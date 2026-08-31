import environment from "@config/environment.config";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getLogger } from "@config/logger.config";

const {
  api: {
    rest: {
      endpoints: {
        auth: { register, login },
      },
    },
  },
} = environment;
const logger = getLogger();
const SAFE_URLS = [register, login];

const isSafeUrl = (candidate: string): boolean => {
  return SAFE_URLS.some((url: string) => candidate.startsWith(url));
};

export const anonTokenInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  const { url } = config;
  if (url && isSafeUrl(url)) {
    logger.info(`Request to safe URL ${url}, skipping token interceptor`);
  }
  return config;
};

export const ownTokenInterceptor = async (
  config: InternalAxiosRequestConfig,
  access_token?: string,
) => {
  if (!access_token) {
    const error = new AxiosError(
      "Not Authenticated",
      "ERR_UNAUTHORIZED",
      config,
    );

    error.response = {
      data: {
        status: 401,
        error: "Unauthorized",
        message: "Not Authenticated",
      },
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config,
    };

    throw error;
  }

  config.headers.Authorization = `Bearer ${access_token}`;

  return config;
};