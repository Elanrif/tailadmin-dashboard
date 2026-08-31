"use client";

import { mutationOptions, useMutation } from "@tanstack/react-query";
import { signIn, signUp } from "@/lib/auth/api/services/auth.client";
import { ChangePwdPayload, DeletePayload, LoginPayload, RegisterPayload, UserPayload } from "../schemas/auth";
import { deleteMyAccountAction, updateMyAccountAction, updateMyPasswordAction } from "./action";
import { userKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";

/* =========================================================
   🔹 SIMPLE UI MUTATIONS (useMutation)
   👉 Utilisées directement dans les composants React
   👉 Logique locale, sans configuration réutilisable
   ========================================================= */

export function useSignIn() {
  return useMutation({
    mutationFn: (data: LoginPayload) => signIn(data),
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => signUp(data),
  });
}


/* =========================================================
   🔸 REUSABLE MUTATION CONFIG (mutationOptions)
   👉 Configuration centralisée (cache, invalidation, etc.)
   👉 Réutilisable avec useMutation(updateMyAccountMutation)
   ========================================================= */
   
export const updateMyAccountMutation = mutationOptions({
  mutationFn: (values: UserPayload) => updateMyAccountAction(values),

  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const updateMyPasswordMutation = mutationOptions({
  mutationFn: (values: ChangePwdPayload) => updateMyPasswordAction(values),
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});

export const deleteMyAccountMutation = mutationOptions({
  mutationFn: (values: DeletePayload) => deleteMyAccountAction(values),
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: userKeys.all });
  },
});
