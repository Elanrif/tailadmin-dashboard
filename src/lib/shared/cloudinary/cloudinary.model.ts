/**
 * Cloudinary types — safe to import in both server and client code.
 */

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resourceType: string;
  bytes: number;
}

export type CloudinaryActionError = {
  detail: string;
};
