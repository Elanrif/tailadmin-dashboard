"use client";

import { mutationOptions } from "@tanstack/react-query";
import type { ApiError } from "@/lib/shared/api-error";
import type { User } from "@/lib/users/api/types";
import {
  changeMyPassword,
  deleteMyAccount,
  updateMyProfile,
} from "@/lib/account/api/services/account.client";
import {
  ChangePwdFormValues,
  CurrentUserFormValues,
  DeleteFormValues,
} from "@/lib/account/schemas/account";

export const updateMyProfileMutation = mutationOptions<
  User,
  ApiError,
  CurrentUserFormValues,
  unknown
>({
  mutationFn: async (values) => {
    const result = await updateMyProfile(values);
    if (!result.ok) throw result.error;
    return result.data;
  },
});

export const updateMyPasswordMutation = mutationOptions<
  User,
  ApiError,
  ChangePwdFormValues,
  unknown
>({
  mutationFn: async (values) => {
    const result = await changeMyPassword(values);
    if (!result.ok) throw result.error;
    return result.data;
  },
});

export const deleteMyAccountMutation = mutationOptions<
  void,
  ApiError,
  DeleteFormValues,
  unknown
>({
  mutationFn: async (values) => {
    const result = await deleteMyAccount(values);
    if (!result.ok) throw result.error;
    return result.data;
  },
});
