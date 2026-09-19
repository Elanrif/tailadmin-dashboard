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
import { getQueryClient } from "@/lib/query-client";
import { currentUserKeys } from "./queries";

export const updateMyProfileMutation = mutationOptions<
  User,
  ApiError,
  CurrentUserFormValues,
  unknown
>({
  mutationFn: (values) => updateMyProfile(values),
  onSuccess: () => {
    void getQueryClient().invalidateQueries({ queryKey: currentUserKeys.all });
  }
});

export const updateMyPasswordMutation = mutationOptions<
  void,
  ApiError,
  ChangePwdFormValues,
  unknown
>({
  mutationFn: (values) => changeMyPassword(values),
  onSuccess: () => {
    void getQueryClient().invalidateQueries({ queryKey: currentUserKeys.all });
  }
});

export const deleteMyAccountMutation = mutationOptions<
  void,
  ApiError,
  DeleteFormValues,
  unknown
>({
  mutationFn: (values) => deleteMyAccount(values),
  onSuccess: () => {
    void getQueryClient().invalidateQueries({ queryKey: currentUserKeys.all });
  }
});
