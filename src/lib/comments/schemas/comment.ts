import { z } from "zod";

/**
 * Comment form schema - only client-side form fields
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 */
export const commentCreateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(2000, "Le commentaire doit contenir au maximum 2000 caractères"),
  postId: z.number().int().positive("Veuillez sélectionner un post"),
  authorId: z.number().int().positive("Veuillez sélectionner un auteur"),
});

export type CommentFormValues = z.infer<typeof commentCreateSchema>;
export const parseCommentCreate =
  commentCreateSchema.safeParse.bind(commentCreateSchema);

export const commentUpdateSchema = commentCreateSchema;
export type CommentUpdateFormValues = z.infer<typeof commentUpdateSchema>;
export const parseCommentUpdate =
  commentUpdateSchema.safeParse.bind(commentUpdateSchema);

/**
 * Comment API schema - includes all required fields for API
 * Used for server-side validation
 */
export const commentApiSchema = z.object({
  content: z.string().min(1, "Le commentaire ne peut pas être vide"),
  postId: z.number().int().min(1, "Veuillez sélectionner un post"),
  authorId: z.number().int().min(1, "L'auteur est requis"),
});

export type CommentApiValues = z.infer<typeof commentApiSchema>;
export const parseCommentApiCreate =
  commentApiSchema.safeParse.bind(commentApiSchema);

export const commentApiUpdateSchema = commentApiSchema.partial();
export type CommentApiUpdateValues = z.infer<typeof commentApiUpdateSchema>;
export const parseCommentApiUpdate = commentApiUpdateSchema.safeParse.bind(
  commentApiUpdateSchema,
);
