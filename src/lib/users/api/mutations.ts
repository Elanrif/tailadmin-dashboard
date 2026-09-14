import { mutationOptions } from "@tanstack/react-query";
import { userKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";
import { createUserAction, deleteUserAction, updateUserAction } from "./action";
import { UserCreateFormValues, UserUpdateFormValues } from "../schemas/user";
import type { ApiError } from "@/lib/shared/api-error";
import type { User } from "./types";

export const createUserMutation = mutationOptions<
  User,
  ApiError,
  UserCreateFormValues,
  unknown
>({
  mutationFn: async (data) => {
    const result = await createUserAction(data);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const updateUserMutation = mutationOptions<
  User,
  ApiError,
  { id: number; values: UserUpdateFormValues },
  unknown
>({
  mutationFn: async ({ id, values }) => {
    const result = await updateUserAction(id, values);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const deleteUserMutation = mutationOptions<
  void,
  ApiError,
  number,
  unknown
>({
  mutationFn: async (id) => {
    const result = await deleteUserAction(id);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});
