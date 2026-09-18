import { queryOptions } from "@tanstack/react-query";
import type { ApiError } from "@/lib/shared/api-error";
import { getMyProfile } from "../services/account.server";
import { currentUserKeys } from ".";
import { User } from "@/lib/users/api/types";

export const myProfileQueryOptions = () =>
  queryOptions<User, ApiError>({
    queryKey: currentUserKeys.me(),
    queryFn: async () => {
      const response = await getMyProfile();
      if (!response.ok) {
        throw response.error;
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
