import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { auth } from "../../../auth";

export async function bearerTokenInterceptor(
  config: InternalAxiosRequestConfig,
) {
  const session = await auth();
  const accessToken = session?.access_token;

  if (!accessToken) {
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

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
}
