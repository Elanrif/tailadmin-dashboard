export const addressKeys = {
  all: ["addresses"] as const,
  byId: (addressId: number) => ["addresses", addressId] as const,
  list: (filters: Record<string, unknown>) =>
    [...addressKeys.all, "list", filters] as const,
  default: (userId: number) =>
    [...addressKeys.all, "user", userId, "default"] as const,
};
