import "server-only";

import { z } from "zod";
import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@/config/logger.config";
import {
  changePasswordSchema,
  CurrentUserSchema,
  deleteFormSchema,
  CurrentUserFormValues,
  ChangePwdFormValues,
  DeleteFormValues,
} from "@/lib/account/schemas/account";
import { User } from "@/lib/users/api/types";
import { Result } from "@/lib/shared/types";
import { ApiError, fromZodError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { account: accountUrl },
    },
  },
} = environment;

const logger = getLogger("server");

export async function updateMyProfile(
  data: CurrentUserFormValues,
): Promise<Result<User, ApiError>> {
  const parse = CurrentUserSchema.safeParse(data);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "updateMyProfile"),
    };
  }

  try {
    const response = await apiClient(true).patch<User>(accountUrl, parse.data);

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
    return {
      ok: false,
      error: ApiError(error, "updateMyProfile"),
    };
  }
}

export async function changeMyPassword(
  data: ChangePwdFormValues,
): Promise<Result<User, ApiError>> {
  const parse = changePasswordSchema.safeParse(data);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "changeMyPassword"),
    };
  }

  try {
    const response = await apiClient(true).patch<User>(accountUrl, parse.data);

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
    return {
      ok: false,
      error: ApiError(error, "updateMyPassword"),
    };
  }
}

export async function deleteMyAccount(
  data: DeleteFormValues,
): Promise<Result<void, ApiError>> {
  const parse = deleteFormSchema.safeParse(data);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "deleteMyAccount"),
    };
  }

  try {
    await apiClient(true).post(accountUrl, parse.data);

    logger.info(
      {
        message: parse.data.message,
      },
      "Account deleted successfully",
    );

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "deleteMyAccount"),
    };
  }
}
