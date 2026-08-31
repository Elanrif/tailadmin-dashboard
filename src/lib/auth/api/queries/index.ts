import { UserFilters } from "@/lib/users/api/types";

export const userKeys = {
  all: ["users"] as const,
  list: (filters: UserFilters) => [...userKeys.all, "list", filters] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
};
