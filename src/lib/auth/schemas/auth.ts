import { z } from "zod";

/**
 * Règles de base partagées (Champs requis dans l'UI)
 */
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

export const UserSchema = z.object({
  ...coreFields,
  avatarUrl: z
    .string()
    .trim()
    .url({ message: "L'URL de l'avatar doit être valide" })
    .max(255, "Avatar URL must be at most 255 characters")
    .optional(),
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

// Nouveau schéma ajouté pour gérer la réinitialisation par Token / Email
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

// --- SCHÉMAS UNIQUES POUR LES COMPOSANTS REACT (Formulaires UI) ---

export const loginFormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const registerFormSchema = z
  .object({
    ...coreFields,
    password: z.string(),
    confirmNewPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must be at least 8 characters",
      });
    }
    if (data.password !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "Passwords do not match",
      });
    }
  });

const MESSAGE_DELETE_ACCOUNT = 'I want to delete my account';
export const deleteFormSchema = z.object({
  emailInput: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  messageInput: z
    .string()
    .trim()
    .refine((val) => val.toUpperCase() === MESSAGE_DELETE_ACCOUNT.toUpperCase(), {
      message: `You must type "${MESSAGE_DELETE_ACCOUNT}" to confirm`,
    }),
});
/**
 * ------------------------------------------------------------------
 * TYPES UI / FORM
 * ------------------------------------------------------------------
 * Ces types représentent les valeurs manipulées côté formulaire
 * (React Hook Form, inputs, valeurs brutes saisies par l'utilisateur).
 *
 * On utilise `z.input<typeof schema>` pour décrire la forme AVANT
 * transformation/normalisation par Zod.
 */
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
export type UserFormValues = z.infer<typeof UserSchema>;
export type ChangePwdFormValues = z.infer<typeof changePasswordSchema>;
export type ResetPwdFormValues = z.infer<typeof resetPasswordSchema>;
export type DeleteFormValues = z.infer<typeof deleteFormSchema>;

/**
 * ------------------------------------------------------------------
 * TYPES API / SERVICE
 * ------------------------------------------------------------------
 * Ces types représentent les données validées et transformées par Zod,
 * prêtes à être envoyées au service ou à l’API.
 *
 * On utilise `z.output<typeof schema>` (équivalent à `z.infer`)
 * pour décrire la forme APRÈS parsing/normalisation.
 */
export type LoginPayload = z.output<typeof loginFormSchema>;
export type RegisterPayload = z.output<typeof registerFormSchema>;
export type UserPayload = z.output<typeof UserSchema>;
export type ChangePwdPayload = z.output<typeof changePasswordSchema>;
export type ResetPwdPayload = z.output<typeof resetPasswordSchema>;
export type DeletePayload = z.output<typeof deleteFormSchema>;
