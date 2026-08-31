import { mutationOptions } from "@tanstack/react-query";
import { userKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";
import { createUserAction, deleteUserAction, updateUserAction } from "./action";
import { UserCreatePayload, UserUpdatePayload } from "../schemas/user";

export const createUserMutation = mutationOptions({
  mutationFn: (data: UserCreatePayload) => createUserAction(data),
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const updateUserMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: UserUpdatePayload }) =>
    updateUserAction(id, values),
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const deleteUserMutation = mutationOptions({
  mutationFn: (id: number) => deleteUserAction(id),
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});
