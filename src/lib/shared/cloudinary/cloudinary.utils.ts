/**
 * Cloudinary utilities — safe to import in both server and client code.
 */

/**
 * Extrait le public_id Cloudinary depuis une secure_url.
 *
 * @example
 * extractPublicId("https://res.cloudinary.com/demo/image/upload/v123/folder/img.jpg")
 * // → "folder/img"
 */
export function extractPublicId(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match?.[1] ?? "";
}

/**
 * Génère une URL de zoom pour une image Cloudinary.
 *
 * @example
 * getCloudinaryZoomUrl("https://res.cloudinary.com/demo/image/upload/v123/folder/img.jpg")
 * // → "https://res.cloudinary.com/demo/image/upload/w_1600,q_auto:best,f_auto,c_limit/folder/img.jpg"
 */
export function getCloudinaryZoomUrl(url: string): string {
  return url.replace(
    /\/upload\/[^/]+\//,
    "/upload/w_1600,q_auto:best,f_auto,c_limit/",
  );
}