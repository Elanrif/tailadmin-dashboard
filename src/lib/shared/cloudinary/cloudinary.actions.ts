"use server";

import { Result } from "../types";
import { cloudinary } from "./cloudinary.config";
import { CloudinaryActionError } from "./cloudinary.model";

/**
 * Server Action: Delete an image from Cloudinary by its public_id.
 * Upload is handled client-side via CldUploadWidget (next-cloudinary).
 *
 * @example
 * const result = await deleteImageAction("nextjs-starter/mon-image-xyz");
 * if (result.ok) console.log("Image supprimée");
 */
export async function deleteImageAction(
  publicId: string,
): Promise<Result<void, CloudinaryActionError>> {
  if (!publicId) {
    return { ok: false, error: { detail: "public_id manquant" } };
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });

    if (res.result !== "ok" && res.result !== "not found") {
      return {
        ok: false,
        error: { detail: "Impossible de supprimer l'image" },
      };
    }

    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: { detail: "Erreur lors de la suppression" } };
  }
}
