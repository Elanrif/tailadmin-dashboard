"use client";

import { mutationOptions } from "@tanstack/react-query";
import type { ApiError } from "@/lib/shared/api-error";
import type { User } from "@/lib/users/api/types";
import {
  forgotPassword,
  logout,
  signIn,
  signUp,
} from "@/lib/auth/api/services/auth.client";
import { LoginFormValues, RegisterFormValues } from "@/lib/auth/schemas/auth";

export const signInMutation = mutationOptions<
  User,
  ApiError,
  LoginFormValues,
  unknown
>({
  mutationFn: async (values) => {
    const result = await signIn(values);
    if (!result.ok) throw result.error;
    return result.data;
  },
});

export const signUpMutation = mutationOptions<
  User,
  ApiError,
  RegisterFormValues,
  unknown
>({
  mutationFn: async (values) => {
    const result = await signUp(values);
    if (!result.ok) throw result.error;
    return result.data;
  },
});

export const forgotPasswordMutation = mutationOptions<
  void,
  ApiError,
  string,
  unknown
>({
  mutationFn: async (email) => {
    const result = await forgotPassword(email);
    if (!result.ok) throw result.error;
    return result.data;
  },
});

export const logoutMutation = mutationOptions<void, ApiError, void, unknown>({
  mutationFn: async () => {
    const result = await logout();
    if (!result.ok) throw result.error;
    return result.data;
  },
});
