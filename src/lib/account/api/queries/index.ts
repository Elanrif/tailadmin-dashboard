export const accountKeys = {
  all: ["users"] as const,
  me: () => [...accountKeys.all, "me"] as const,
};
