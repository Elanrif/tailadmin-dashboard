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
  mutationFn: (values) => signIn(values),
});

export const signUpMutation = mutationOptions<
  User,
  ApiError,
  RegisterFormValues,
  unknown
>({
  mutationFn: (values) => signUp(values),
});

export const forgotPasswordMutation = mutationOptions<
  void,
  ApiError,
  string,
  unknown
>({
  mutationFn: (email) => forgotPassword(email),
});

export const logoutMutation = mutationOptions<void, ApiError, void, unknown>({
  mutationFn: () => logout(),
});
