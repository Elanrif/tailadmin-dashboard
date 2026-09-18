import axios, { AxiosError } from "axios";
import { baseRequestConfig } from "@config/axios/base-request.config";
import { Logger } from "@config/logger.config";
import {
  requestLoggerInterceptor,
  responseLoggerInterceptor,
} from "@config/interceptors/logger.interceptor";
import { expiredSessionInterceptor } from "@config/interceptors/auth.interceptor";
import { sessionCookieInterceptor } from "@config/interceptors/auth.interceptor";
import { bearerTokenInterceptor } from "@config/interceptors/bearer-token.interceptor";

export { baseRequestConfig } from "@config/axios/base-request.config";
export default function httpClient({
  logger,
  authenticated = false,
}: {
  logger: Logger;
  authenticated?: boolean;
}) {
  const instance = axios.create({
    ...baseRequestConfig,
  });
  instance.interceptors.request.use(
    requestLoggerInterceptor(logger),
    (error: any) => {
      logger.error({ error: error.message }, "Outgoing request failed");
      return Promise.reject(error);
    },
  );
  if (authenticated) {
    instance.interceptors.request.use(
      process.env.NEXT_PUBLIC_AUTH_PROVIDER === "keycloak"
        ? bearerTokenInterceptor
        : sessionCookieInterceptor,
    );
  }
  instance.interceptors.response.use(
    responseLoggerInterceptor(logger),
    (error: AxiosError) => {
      const data = {
        ...((error.response?.data ?? {}) as Record<string, unknown>),
      };
      delete data.trace;
      logger.error({ error: error.message, ...data }, "API error");
      return expiredSessionInterceptor(error);
    },
  );
  return instance;
}
