"use client";

import axios from "axios";
import environment from "@config/environment.config";
import { baseRequestConfig } from "@config/axios/base-request.config";
import { clearAuthSession } from "@/lib/auth/auth-session";

const { apiBaseUrl, apiProxyBase } = environment;
const PUBLIC_AUTH_URLS = ["/auth/login", "/auth/register"];

function isPublicAuthRequest(url?: string): boolean {
  return Boolean(
    url && PUBLIC_AUTH_URLS.some((publicUrl) => url.includes(publicUrl)),
  );
}

export function frontendHttp() {
  const instance = axios.create({
    ...baseRequestConfig,
    baseURL: typeof window === "undefined" ? apiBaseUrl : apiProxyBase,
  });
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      if (
        (status === 401 || status === 403) &&
        !isPublicAuthRequest(error.config?.url)
      ) {
        clearAuthSession();
      }

      return Promise.reject(error);
    },
  );
  return instance;
}
