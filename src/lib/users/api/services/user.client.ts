import { AxiosResponse } from "axios";
import { proxyEnvironment } from "@config/proxy-api.config";
import { User, UserFilters, UsersResponse } from "@lib/users/api/types";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

/**
 * ⚠️ NO Logging and error Handling is needed here as the proxy API routes will handle logging.
 * User client service for handling user operations.
 * This service interacts with the proxy API endpoints for user management.
 */

const {
  api: {
    rest: {
      endpoints: { users: usersUrl },
    },
  },
} = proxyEnvironment;

export async function fetchUsers(
  filters: UserFilters = {},
): Promise<Result<UsersResponse, ApiError>> {
  // 🔥 Clean undefined params
  const cleanParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      cleanParams[key] = String(value);
    }
  }
  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = `${usersUrl}${queryParams ? `?${queryParams}` : ""}`;

  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<UsersResponse, ApiError>>
  >(url);
  return res.data;
}

export async function fetchUserById(
  id: number,
): Promise<Result<User, ApiError>> {
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<User, ApiError>>
  >(`${usersUrl}/${id}`);
  return res.data;
}

/**
 *  ⚠️Methods below are not used, just an example if we want to call API routes directly,
 *  from client components without going through server actions.
 *  ✅We use server actions for mutations to leverage revalidation
 *  and avoid handling client-side state management (loading, error).
 * @param user
 * @returns
 */

// export async function createUser(
//   user: UserCreatePayload,
// ): Promise<Result<User, ApiError>> {
//   const res = await frontendHttp().post<
//     unknown,
//     AxiosResponse<Result<User, ApiError>>
//   >(usersUrl, user);
//   return res.data;
// }

// export async function updateUser(
//   id: number,
//   user: UserUpdatePayload,
// ): Promise<Result<User, ApiError>> {
//   const res = await frontendHttp().patch<
//     unknown,
//     AxiosResponse<Result<User, ApiError>>
//   >(`${usersUrl}/${id}`, user);
//   return res.data;
// }

// export async function deleteUser(
//   id: number,
// ): Promise<Result<{ success: boolean }, ApiError>> {
//   const res = await frontendHttp().delete<
//     unknown,
//     AxiosResponse<Result<{ success: boolean }, ApiError>>
//   >(`${usersUrl}/${id}`);
//   return res.data;
// }
