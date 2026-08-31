import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Logger } from "@config/logger.config";

export const requestLoggerInterceptor =
  (logger: Logger) =>
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    logger.debug(
      {
        method: config.method?.toUpperCase(),
        url: config.url,
      },
      "Request",
    );
    return config;
  };

export const responseLoggerInterceptor =
  (logger: Logger) =>
  (response: AxiosResponse): AxiosResponse => {
    logger.debug(
      {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
      },
      "Response received",
    );
    return response;
  };
