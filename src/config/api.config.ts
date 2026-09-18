import httpClient from "@config/axios.config";
import { anonTokenInterceptor } from "@config/interceptors/auth.interceptor";
import { getLogger } from "@config/logger.config";

const logger = getLogger("server");

export type Config = {
  access_token?: string;
  headers?: Headers;
};

// Creates a child logger that automatically includes reqId in every log entry.
// Replaces the old RequestLogger class — Pino's child() is the idiomatic approach.
const apiLogger = (config?: Config) => {
  if (config?.headers) {
    const headers = new Headers(config.headers);
    const reqId = headers.get("X-Request-ID");
    if (reqId) return logger.child({ reqId });
  }
  return logger;
};

// own = true for authenticated requests, false for public/anonymous requests.
export default function apiClient(own?: boolean, config?: Config) {
  const instance = httpClient({
    logger: apiLogger(config),
    authenticated: own,
  });

  if (!own) {
    instance.interceptors.request.use(anonTokenInterceptor);
  }

  return instance;
}
