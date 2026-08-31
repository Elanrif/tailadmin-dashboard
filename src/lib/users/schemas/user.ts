import { z } from "zod";
import { UserRole, UserStatus } from "../api/types";

/**
 * ------------------------------------------------------------------
 * RÈGLES DE BASE PARTAGÉES
 * ------------------------------------------------------------------
 */
const coreFields = {
  avatarUrl: z.string().optional().default(""),
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
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus).default(UserStatus.ACTIVE),
};

export const userBaseSchema = z.object(coreFields);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be at most 255 characters");

const optionalPasswordSchema = z
  .string()
  .optional()
  .transform((val) =>
    val === undefined || val.trim() === "" ? undefined : val,
  )
  .pipe(passwordSchema.optional());

/**
 * ------------------------------------------------------------------
 * SCHÉMAS API / SERVICE
 * ------------------------------------------------------------------
 */

export const userCreateSchema = userBaseSchema
  .extend({
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


export const userUpdateSchema = userBaseSchema
  .partial()
  .extend({
    password: optionalPasswordSchema,
    confirmPassword: optionalPasswordSchema,
  })
  .superRefine((data, ctx) => {
    const hasPassword = !!data.password;
    const hasConfirm = !!data.confirmPassword;
    if (!hasPassword && !hasConfirm) return;
    if (hasPassword !== hasConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Both password fields are required",
      });
      return;
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });


export const userFormSchema = z
  .object({
    ...coreFields,
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const isFieldsEmpty =
      data.password.trim() === "" && data.confirmPassword.trim() === "";

    if (
      !isFieldsEmpty ||
      data.password.length > 0 ||
      data.confirmPassword.length > 0
    ) {
      if (data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must be at least 8 characters",
        });
      }
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    }
  });

/**
 * ------------------------------------------------------------------
 * Types UI / Form
 * ------------------------------------------------------------------
 */
export type UserCreateFormValues = z.input<typeof userCreateSchema>;
export type UserUpdateFormValues = z.input<typeof userUpdateSchema>;

/**
 * ------------------------------------------------------------------
 * Types API / Service
 * ------------------------------------------------------------------
 */
export type UserCreatePayload = z.output<typeof userCreateSchema>;
export type UserUpdatePayload = z.output<typeof userUpdateSchema>;
