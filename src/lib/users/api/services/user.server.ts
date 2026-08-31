import "server-only";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import { User, UserFilters, UsersResponse } from "@/lib/users/api/types";
import {
  UserCreatePayload,
  UserUpdatePayload,
  userCreateSchema,
  userUpdateSchema,
} from "@/lib/users/schemas/user";
import { validateId } from "@/utils";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { users: usersUrl },
    },
  },
} = environment;

const logger = getLogger("server");

const userUrl = (id: number) => `${usersUrl}/${id}`;

export async function getUsers(
  filters: UserFilters = {},
): Promise<Result<UsersResponse, ApiError>> {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = params.toString()
      ? `${usersUrl}?${params.toString()}`
      : usersUrl;

    const response = await apiClient().get<UsersResponse>(url);

    logger.info(
      {
        filters,
        count: response.data.meta.total,
      },
      "Users fetched",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getUsers"),
    };
  }
}

export async function createUser(
  user: UserCreatePayload,
): Promise<Result<User, ApiError>> {
  const parse = userCreateSchema.safeParse(user);

  // Zod error: the validation error is already known locally,
  // so we directly return it as an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        context: "createUser",
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
    const response = await apiClient().post<User>(usersUrl, parse.data);

    logger.info({
        id: response.data.id,
      },
      "User created",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "createUser"),
    };
  }
}

export async function getUserById(
  id: number,
): Promise<Result<User, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  try {
    const response = await apiClient().get<User>(userUrl(id));

    logger.info({ id }, "User fetched");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getUserById"),
    };
  }
}

export async function updateUser(
  id: number,
  user: UserUpdatePayload,
): Promise<Result<User, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  const parse = userUpdateSchema.safeParse(user);

  // Zod error: the validation error is already known locally,
  // so we directly return it as an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        context: "updateUser",
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
      userUrl(id),
      parse.data,
    );

    logger.info({ id }, "User updated");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "updateUser"),
    };
  }
}

export async function deleteUser(
  id: number,
): Promise<Result<void, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  try {
    await apiClient().delete(userUrl(id));

    logger.info({ id }, "User deleted");

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "deleteUser"),
    };
  }
}