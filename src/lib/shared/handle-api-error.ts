"use client";

import { AxiosError } from "axios";
import type { ApiError } from "./api-error";

export function unwrapApiError(error: unknown): ApiError {
  if (error instanceof AxiosError && error.response?.data) {
    return error.response.data as ApiError;
  }
  return {
    status: 0,
    error: "Network Error",
    message: error instanceof Error ? error.message : "Unknown error",
  };
}
