"use server";

import { queryOptions } from "@tanstack/react-query";
import type { UserFilters } from "../types";
import { userKeys } from ".";
import { getUserById, getUsers } from "../services/user.server";
import type { User, UsersResponse } from "../types";
import type { ApiError } from "@/lib/shared/api-error";

export const usersQueryOptions = (filters: UserFilters) =>
  queryOptions<UsersResponse, ApiError>({
    queryKey: userKeys.list(filters),
    queryFn: async () => {
      const response = await getUsers(filters);
      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });

export const userByIdQueryOptions = (id: number) =>
  queryOptions<User, ApiError>({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await getUserById(id);
      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });
