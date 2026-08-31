import { AxiosResponse } from "axios";
import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { User } from "@/lib/users/api/types";
import { LoginPayload, RegisterPayload } from "../../schemas/auth";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

/**
 * ⚠️ NO Logging and error Handling is needed here as the proxy API routes will handle logging.
 * Auth client service for handling user authentication operations.
 * This service interacts with the proxy API endpoints for authentication.
 */
const {
  api: {
    rest: {
      endpoints: { register: registerUrl, login: loginUrl },
    },
  },
} = proxyEnvironment;

export async function signIn(
  login: LoginPayload,
): Promise<Result<User, ApiError>> {
  const result = await frontendHttp().post<
    any,
    AxiosResponse<Result<User, ApiError>>
  >(loginUrl, login);
  return result.data;
}

export async function signUp(
  registration: RegisterPayload,
): Promise<Result<User, ApiError>> {
  const res = await frontendHttp().post<
    any,
    AxiosResponse<Result<User, ApiError>>
  >(registerUrl, registration);
  return res.data;
}
