export const currentUserKeys = {
  all: ["current-user"] as const,
  me: () => [...currentUserKeys.all, "me"] as const,
};
