"use client";

import axios from "axios";
import environment from "@config/environment.config";
import { baseRequestConfig } from "@config/axios/base-request.config";

const { apiBaseUrl, apiProxyBase } = environment;

export function frontendHttp() {
  const instance = axios.create({
    ...baseRequestConfig,
    baseURL: typeof window === "undefined" ? apiBaseUrl : apiProxyBase,
  });
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // When the status code is 401(unauthorized http code), display the session expired modal
      if (error.response?.status === 401) {
        console.warn("Session expired. Please log in again.");
      }
      return Promise.reject(error);
    },
  );
  return instance;
}
