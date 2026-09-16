"use client";

import axios from "axios";
import environment from "@config/environment.config";
import { baseRequestConfig } from "@config/axios/base-request.config";
import { clearAuthSession } from "@/lib/auth/auth-session";
import { ROUTES } from "@/utils/routes";

const { apiBaseUrl, apiProxyBase } = environment;
const PUBLIC_AUTH_URLS = ["/auth/login", "/auth/register"];
const PUBLIC_READ_URLS = ["/posts", "/comments"];

function isPublicAuthRequest(url?: string): boolean {
  return Boolean(
    url && PUBLIC_AUTH_URLS.some((publicUrl) => url.includes(publicUrl)),
  );
}

function isPublicReadRequest(config?: { url?: string; method?: string }) {
  const method = config?.method?.toLowerCase() ?? "get";

  return (
    method === "get" &&
    Boolean(
      config?.url &&
        PUBLIC_READ_URLS.some((publicUrl) => config.url?.includes(publicUrl)),
    )
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
        !isPublicAuthRequest(error.config?.url) &&
        !isPublicReadRequest(error.config)
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
