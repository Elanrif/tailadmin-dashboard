import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { User, UserFilters, UsersResponse } from "@lib/users/api/types";
import { UserCreateFormValues, UserUpdateFormValues } from "../../schemas/user";
import { unwrapApiError } from "@/lib/shared/handle-api-error";

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
): Promise<UsersResponse> {
  try {
    const { data } = await frontendHttp().get<UsersResponse>(usersUrl, {
      params: filters,
    });
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function fetchUserById(id: number): Promise<User> {
  try {
    const { data } = await frontendHttp().get<User>(`${usersUrl}/${id}`);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

// --- Mutations ---

export async function createUser(payload: UserCreateFormValues): Promise<User> {
  try {
    const { data } = await frontendHttp().post<User>(usersUrl, payload);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function updateUser(
  id: number,
  payload: UserUpdateFormValues,
): Promise<User> {
  try {
    const { data } = await frontendHttp().patch<User>(
      `${usersUrl}/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function deleteUser(id: number): Promise<void> {
  try {
    await frontendHttp().delete(`${usersUrl}/${id}`);
  } catch (error) {
    throw unwrapApiError(error);
  }
}
