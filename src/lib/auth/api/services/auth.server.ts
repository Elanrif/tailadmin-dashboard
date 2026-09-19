import "server-only";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@/config/logger.config";
import {
  loginFormSchema,
  registerFormSchema,
  resetPasswordSchema,
  LoginFormValues,
  RegisterFormValues,
  ResetPwdFormValues,
} from "@lib/auth/schemas/auth";
import { User } from "@/lib/users/api/types";
import { Result } from "@/lib/shared/types";
import { ApiError, fromZodError } from "@/lib/shared/api-error";
import { cookies } from "next/headers";
import {
  signIn as keycloakSignIn,
  signOut as keycloakSignOut,
} from "@/../auth";

const {
  api: {
    rest: {
      endpoints: {
        auth: {
          register: registerUrl,
          login: loginUrl,
          logout: logoutUrl,
          forgotPassword: forgotPasswordUrl,
          resetPassword: resetPasswordUrl,
        },
      },
    },
  },
} = environment;

const logger = getLogger("server");

export async function signIn(
  login: LoginFormValues,
): Promise<Result<User, ApiError>> {
  if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === "keycloak") {
    await keycloakSignIn("keycloak", { redirectTo: "/dashboard" });
    return { ok: true, data: {} as User };
  }

  const parse = loginFormSchema.safeParse(login);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "signIn"),
    };
  }

  try {
    const response = await apiClient().post<User>(loginUrl, parse.data);
    // Spring renvoie le Set-Cookie ici — Axios ne le propage jamais tout seul
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      for (const rawCookie of setCookieHeader) {
        const [nameValue] = rawCookie.split(";");
        const [name, value] = nameValue.split("=");
        cookieStore.set(name.trim(), value, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        });
      }
    }

    logger.info(
      {
        id: response.data.id,
        email: response.data.email,
      },
      "User signed in",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "signIn"),
    };
  }
}

export async function forgotPassword(
  email: string,
): Promise<Result<void, ApiError>> {
  const normalizedEmail = email.trim();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return {
      ok: false,
      error: {
        status: 400,
        error: "Bad Request",
        message: "Please provide a valid email address",
      },
    };
  }

  try {
    await apiClient().post(forgotPasswordUrl, { email: normalizedEmail });

    logger.info(
      {
        email: normalizedEmail,
      },
      "Password reset email requested",
    );

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "forgotPassword"),
    };
  }
}

export async function logout(): Promise<Result<void, ApiError>> {
  if (process.env.NEXT_PUBLIC_AUTH_PROVIDER === "keycloak") {
    await keycloakSignOut({ redirectTo: "/sign-in" });
    return { ok: true, data: undefined };
  }

  try {
    const response = await apiClient().post(logoutUrl);
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      const cookieStore = await cookies();

      for (const rawCookie of setCookieHeader) {
        const [nameValue] = rawCookie.split(";");
        const [name] = nameValue.split("=");

        if (!name) continue;

        cookieStore.set(name.trim(), "", {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
          expires: new Date(0),
        });
      }
    }

    logger.info("User signed out");

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "logout"),
    };
  }
}

export async function signUp(
  registration: RegisterFormValues,
): Promise<Result<User, ApiError>> {
  const parse = registerFormSchema.safeParse(registration);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "signUp"),
    };
  }

  try {
    await apiClient().post(registerUrl, parse.data);
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "signUp"),
    };
  }

  const signInResult = await signIn({
    email: parse.data.email,
    password: parse.data.password,
  });

  if (!signInResult.ok) {
    logger.error(
      {
        context: "signUp",
        email: parse.data.email,
        error: signInResult.error,
      },
      "Automatic sign-in after registration failed",
    );

    throw new Error(signInResult.error.message);
  }

  logger.info(
    {
      id: signInResult.data.id,
      email: signInResult.data.email,
    },
    "User registered successfully",
  );

  return signInResult;
}

export async function resetPassword(
  data: ResetPwdFormValues,
): Promise<Result<User, ApiError>> {
  const parse = resetPasswordSchema.safeParse(data);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "resetPassword"),
    };
  }

  try {
    const response = await apiClient().patch<User>(
      resetPasswordUrl,
      parse.data,
    );

    logger.info(
      {
        id: response.data.id,
        email: response.data.email,
      },
      "Password reset successfully",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "resetPassword"),
    };
  }
}
