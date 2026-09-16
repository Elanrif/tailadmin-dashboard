import { z } from "zod";

export const CurrentUserSchema = z.object({
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
  avatarUrl: z.string().trim().max(1000, "Avatar URL is too long").optional(),
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be at most 255 characters");

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required")
    .max(255, "Current password must be at most 255 characters"),
  newPassword: passwordSchema,
});

const MESSAGE_DELETE_ACCOUNT = "I want to delete my account";
export const deleteFormSchema = z.object({
  message: z
    .string()
    .trim()
    .refine(
      (val) => val.toUpperCase() === MESSAGE_DELETE_ACCOUNT.toUpperCase(),
      {
        message: `You must type "${MESSAGE_DELETE_ACCOUNT}" to confirm`,
      },
    ),
});

export type CurrentUserFormValues = z.infer<typeof CurrentUserSchema>;
export type ChangePwdFormValues = z.infer<typeof changePasswordSchema>;
export type DeleteFormValues = z.infer<typeof deleteFormSchema>;
