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
