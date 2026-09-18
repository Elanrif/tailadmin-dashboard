import { queryOptions } from "@tanstack/react-query";
import type { ApiError } from "@/lib/shared/api-error";
import { getMyProfile } from "../services/account.client";
import { currentUserKeys } from ".";
import { User } from "@/lib/users/api/types";

export const myProfileQueryOptions = () =>
  queryOptions<User, ApiError>({
    queryKey: currentUserKeys.me(),
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000,
  });
