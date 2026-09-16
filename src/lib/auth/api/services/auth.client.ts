import { AxiosResponse } from "axios";
import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { User } from "@/lib/users/api/types";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";
import { LoginFormValues, RegisterFormValues } from "../../schemas/auth";

const {
  api: {
    rest: {
      endpoints: {
        register: registerUrl,
        login: loginUrl,
        signOut: signOutUrl,
        forgotPassword: forgotPasswordUrl,
      },
    },
  },
} = proxyEnvironment;

export async function signIn(
  login: LoginFormValues,
): Promise<Result<User, ApiError>> {
  const result = await frontendHttp().post<
    any,
    AxiosResponse<Result<User, ApiError>>
  >(loginUrl, login);
  return result.data;
}

export async function signUp(
  registration: RegisterFormValues,
): Promise<Result<User, ApiError>> {
  const res = await frontendHttp().post<
    any,
    AxiosResponse<Result<User, ApiError>>
  >(registerUrl, registration);
  return res.data;
}

export async function logout(): Promise<Result<void, ApiError>> {
  const res = await frontendHttp().post<
    any,
    AxiosResponse<Result<void, ApiError>>
  >(signOutUrl);
  return res.data;
}

export async function forgotPassword(
  email: string,
): Promise<Result<void, ApiError>> {
  const res = await frontendHttp().post<
    any,
    AxiosResponse<Result<void, ApiError>>
  >(forgotPasswordUrl, { email });
  return res.data;
}
