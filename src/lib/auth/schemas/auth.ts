import { z } from "zod";

const coreFields = {
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(200, "First name must be at most 200 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(200, "Last name must be at most 200 characters"),
  phoneNumber: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(50, "Phone number must be at most 50 digits"),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, "Email must be at most 255 characters"),
};

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be at most 255 characters");

export const CurrentUserSchema = z.object({
  ...coreFields,
});

export const changePasswordSchema = z
  .object({
    email: coreFields.email,
    currentPassword: z.string().min(1, "Current password is required").max(50),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const resetPasswordSchema = z
  .object({
    email: coreFields.email,
    token: z.string().min(1, "Token is required"),
    password: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const loginFormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const registerFormSchema = z
  .object({
    ...coreFields,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

const MESSAGE_DELETE_ACCOUNT = "I want to delete my account";
export const deleteFormSchema = z.object({
  emailInput: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  messageInput: z
    .string()
    .trim()
    .refine(
      (val) => val.toUpperCase() === MESSAGE_DELETE_ACCOUNT.toUpperCase(),
      {
        message: `You must type "${MESSAGE_DELETE_ACCOUNT}" to confirm`,
      },
    ),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type UserCreateFormValues = z.infer<typeof CurrentUserSchema>;
export type ChangePwdFormValues = z.infer<typeof changePasswordSchema>;
export type ResetPwdFormValues = z.infer<typeof resetPasswordSchema>;
export type DeleteFormValues = z.infer<typeof deleteFormSchema>;
