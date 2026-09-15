"use client";

import axios from "axios";
import environment from "@config/environment.config";
import { baseRequestConfig } from "@config/axios/base-request.config";
import { clearAuthSession } from "@/lib/auth/auth-session";
import { ROUTES } from "@/utils/routes";

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
        (status === 401) &&
        !isPublicAuthRequest(error.config?.url)
      ) {
        clearAuthSession();
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.SIGN_IN;
        }
      }
      return Promise.reject(error);
    },
  );
  return instance;
}
