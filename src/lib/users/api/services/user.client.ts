import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { User, UserFilters, UsersResponse } from "@lib/users/api/types";
import { UserCreateFormValues, UserUpdateFormValues } from "../../schemas/user";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { users: usersUrl },
    },
  },
} = proxyEnvironment;

// --- Queries ---

export async function fetchUsers(
  filters: UserFilters = {},
): Promise<Result<UsersResponse, ApiError>> {
  const { data } = await frontendHttp().get<Result<UsersResponse, ApiError>>(
    usersUrl,
    { params: filters },
  );

  return data;
}

export async function fetchUserById(
  id: number,
): Promise<Result<User, ApiError>> {
  const { data } = await frontendHttp().get<Result<User, ApiError>>(
    `${usersUrl}/${id}`,
  );

  return data;
}

// --- Mutations ---

export async function createUser(
  payload: UserCreateFormValues,
): Promise<Result<User, ApiError>> {
  const { data } = await frontendHttp().post<Result<User, ApiError>>(
    usersUrl,
    payload,
  );

  return data;
}

export async function updateUser(
  id: number,
  payload: UserUpdateFormValues,
): Promise<Result<User, ApiError>> {
  const { data } = await frontendHttp().patch<Result<User, ApiError>>(
    `${usersUrl}/${id}`,
    payload,
  );

  return data;
}

export async function deleteUser(id: number): Promise<Result<void, ApiError>> {
  const { data } = await frontendHttp().delete<Result<void, ApiError>>(
    `${usersUrl}/${id}`,
  );

  return data;
}
