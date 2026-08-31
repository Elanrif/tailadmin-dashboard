import "server-only";

import { AxiosError } from "axios";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

/**
 * Error response returned by the Spring Boot API.
 *
 * This type represents the common error structure expected from
 * the backend and is also used as the normalized error structure
 * throughout the Next.js server layer.
 */
export type ApiError = {
  timestamp?: string;
  status: number;
  error: string;
  message: string;
  path?: string;
};

/**
 * Normalizes any caught error into a consistent ApiError.
 *
 * This is the main entry point for error handling:
 * - AxiosError → extracts the error returned by the Spring Boot API.
 * - Other errors → converts them into a generic HTTP 500 error.
 * - The normalized error is then logged before being returned.
 *
 * @param error - the error caught by the caller
 * @param context - call-site name used to identify the source in logs
 *                  (e.g. "fetchProducts")
 */
export function ApiError(error: unknown, context?: string): ApiError {
  const apiError =
    error instanceof AxiosError
      ? fromAxiosError(error)
      : fromUnknownError(error);

  logApiError(apiError, context);

  return apiError;
}

/**
 * Extracts and normalizes the error response returned by Spring Boot.
 *
 * Axios exposes the backend response through `error.response.data`.
 * Since the response may be missing or incomplete, each property
 * falls back to a safe default.
 *
 * The HTTP status from Axios is used as a fallback when the backend
 * response does not contain a valid status.
 */
function fromAxiosError(error: AxiosError): ApiError {
  const data = error.response?.data as Partial<ApiError> | undefined;

  return {
    timestamp: data?.timestamp,
    status: data?.status ?? error.response?.status ?? 500,
    error: data?.error ?? "Internal Server Error",
    message: data?.message ?? error.message ?? "Unknown Axios error",
    path: data?.path,
  };
}

/**
 * Converts a non-Axios error into a generic ApiError.
 *
 * These errors can come from unexpected failures in the server layer
 * rather than from an HTTP response returned by the backend.
 *
 * They are therefore treated as Internal Server Error (HTTP 500).
 */
function fromUnknownError(error: unknown): ApiError {
  return {
    status: 500,
    error: "Internal Server Error",
    message: error instanceof Error ? error.message : "Unknown error",
  };
}

/**
 * Logs a normalized ApiError according to its HTTP status.
 *
 * - 4xx errors → warning, because they represent client/request errors.
 * - 5xx errors → error, because they represent server-side failures.
 *
 * The optional context identifies the operation that produced the error.
 */
function logApiError(error: ApiError, context?: string): void {
  const prefix = `[API Error] [${context ?? "unknown"}]`;

  if (error.status >= 500) {
    logger.error(error, prefix);
  } else {
    logger.warn(error, prefix);
  }
}
