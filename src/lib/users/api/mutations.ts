import { mutationOptions } from "@tanstack/react-query";
import { userKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";
import { UserCreateFormValues, UserUpdateFormValues } from "../schemas/user";
import type { ApiError } from "@/lib/shared/api-error";
import type { User } from "./types";
import { postKeys } from "@/lib/posts/api/queries";
import { commentKeys } from "@/lib/comments/api/queries";
import { addressKeys } from "@/lib/addresses/api/queries";
import { createUser, updateUser, deleteUser } from "./services/user.client";

export const createUserMutation = mutationOptions<
  User,
  ApiError,
  UserCreateFormValues,
  unknown
>({
  mutationFn: (payload) => createUser(payload),
  onSuccess: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const updateUserMutation = mutationOptions<
  User,
  ApiError,
  { id: number; values: UserUpdateFormValues },
  unknown
>({
  mutationFn: ({ id, values }) => updateUser(id, values),
  onSuccess: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const deleteUserMutation = mutationOptions<
  void,
  ApiError,
  number,
  unknown
>({
  mutationFn: (id) => deleteUser(id),
  onSuccess: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
    void getQueryClient().invalidateQueries({ queryKey: postKeys.all });
    void getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
    void getQueryClient().invalidateQueries({ queryKey: addressKeys.all });
  },
});
