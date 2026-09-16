import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { User } from "@/lib/users/api/types";
import { unwrapApiError } from "@/lib/shared/handle-api-error";
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

export async function signIn(login: LoginFormValues): Promise<User> {
  try {
    const { data } = await frontendHttp().post<User>(loginUrl, login);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function signUp(registration: RegisterFormValues): Promise<User> {
  try {
    const { data } = await frontendHttp().post<User>(registerUrl, registration);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function logout(): Promise<void> {
  try {
    await frontendHttp().post(signOutUrl);
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await frontendHttp().post(forgotPasswordUrl, { email });
  } catch (error) {
    throw unwrapApiError(error);
  }
}
