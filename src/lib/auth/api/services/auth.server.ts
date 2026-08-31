import "server-only";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@/config/logger.config";
import {
  loginFormSchema,
  registerFormSchema,
  changePasswordSchema,
  type LoginPayload,
  type RegisterPayload,
  type ChangePwdPayload,
  type ResetPwdPayload,
  resetPasswordSchema,
  UserSchema,
  type UserPayload,
  type DeletePayload,
  deleteFormSchema,
} from "@lib/auth/schemas/auth";
import { User } from "@/lib/users/api/types";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: {
        auth: {
          deleteMyAccount: deleteMyAccountUrl,
          login: loginUrl,
          register: registerUrl,
          editMyAccount: editMyAccountUrl,
          changeMyPwd: changeMyPwdUrl,
          resetPassword: resetPasswordUrl,
        },
      },
    },
  },
} = environment;

const logger = getLogger("server");

export async function signIn(
  login: LoginPayload,
): Promise<Result<User, ApiError>> {
  const parse = loginFormSchema.safeParse(login);

  // Zod validation error: the error is already known locally,
  // so we directly create an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        email: login.email,
        errors: parse.error.format(),
      },
      "Validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    const response = await apiClient().post<User>(loginUrl, parse.data);

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
    // Backend/Axios error: ApiError normalizes the Spring Boot response
    // and handles the corresponding logging.
    return {
      ok: false,
      error: ApiError(error, "signIn"),
    };
  }
}

export async function signUp(
  registration: RegisterPayload,
): Promise<Result<User, ApiError>> {
  const parse = registerFormSchema.safeParse(registration);

  // Zod validation error: directly create the ApiError.
  if (!parse.success) {
    logger.warn(
      {
        email: registration.email,
        errors: parse.error.format(),
      },
      "Validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    await apiClient().post(registerUrl, parse.data);
  } catch (error) {
    // Backend/Axios error: normalize it through ApiError.
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
  data: ResetPwdPayload,
): Promise<Result<User, ApiError>> {
  const parse = resetPasswordSchema.safeParse(data);

  // Zod validation error: directly create the ApiError.
  if (!parse.success) {
    logger.warn(
      {
        email: data.email,
        errors: parse.error.format(),
      },
      "Validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
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
    // Backend/Axios error: normalize it through ApiError.
    return {
      ok: false,
      error: ApiError(error, "resetPassword"),
    };
  }
}

export async function updateMyAccount(
  data: UserPayload,
): Promise<Result<User, ApiError>> {
  const parse = UserSchema.safeParse(data);

  // Zod validation error: directly create the ApiError.
  if (!parse.success) {
    logger.warn(
      {
        email: data.email,
        errors: parse.error.format(),
      },
      "Validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    const response = await apiClient().patch<User>(
      editMyAccountUrl,
      parse.data,
    );

    logger.info(
      {
        id: response.data.id,
        email: response.data.email,
      },
      "Profile updated successfully",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: normalize it through ApiError.
    return {
      ok: false,
      error: ApiError(error, "updateMyAccount"),
    };
  }
}

export async function updateMyPassword(
  data: ChangePwdPayload,
): Promise<Result<User, ApiError>> {
  const parse = changePasswordSchema.safeParse(data);

  // Zod validation error: directly create the ApiError.
  if (!parse.success) {
    logger.warn(
      {
        email: data.email,
        errors: parse.error.format(),
      },
      "Validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    const response = await apiClient().patch<User>(changeMyPwdUrl, parse.data);

    logger.info(
      {
        id: response.data.id,
        email: response.data.email,
      },
      "Password updated successfully",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: normalize it through ApiError.
    return {
      ok: false,
      error: ApiError(error, "updateMyPassword"),
    };
  }
}

export async function deleteMyAccount(
  data: DeletePayload,
): Promise<Result<void, ApiError>> {
  const parse = deleteFormSchema.safeParse(data);

  // Zod validation error: directly create the ApiError.
  if (!parse.success) {
    logger.warn(
      {
        email: data.emailInput,
        errors: parse.error.format(),
      },
      "Validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    await apiClient().post(deleteMyAccountUrl, parse.data);

    logger.info(
      {
        email: parse.data.emailInput,
      },
      "Account deleted successfully",
    );

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    // Backend/Axios error: normalize it through ApiError.
    return {
      ok: false,
      error: ApiError(error, "deleteMyAccount"),
    };
  }
}
