import { z } from "zod";

const postFields = {
  title: z
    .string()
    .trim()
    .min(3, "Le titre ne peut pas être vide")
    .max(200, "Le titre doit contenir au maximum 200 caractères"),
  imageUrl: z
    .string()
    .trim()
    .max(200, "L'image doit contenir au maximum 200 caractères")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .min(3, "La description ne peut pas être vide")
    .max(2000, "La description doit contenir au maximum 2000 caractères"),
  likes: z
    .number()
    .int()
    .nonnegative("Les likes doivent être positifs ou nuls"),
  authorId: z.number().int().positive().optional(),
};


/**
 * ------------------------------------------------------------------
 * SCHÉMAS API / SERVICE
 * ------------------------------------------------------------------
*/
export const postCreateSchema = z.object(postFields);
export const postUpdateSchema = postCreateSchema.partial();

/**
 * ------------------------------------------------------------------
 * Types UI / Form
 * ------------------------------------------------------------------
*/
export type PostFormValues = z.input<typeof postCreateSchema>;
export type PostUpdateFormValues = z.input<typeof postUpdateSchema>;

/**
 * ------------------------------------------------------------------
 * Types API / Service
 * ------------------------------------------------------------------
*/
export type PostCreatePayload = z.output<typeof postCreateSchema>;
export type PostUpdatePayload = z.output<typeof postUpdateSchema>;
