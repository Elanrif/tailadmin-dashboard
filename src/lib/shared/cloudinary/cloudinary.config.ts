/**
 * Cloudinary SDK configuration — server-only.
 * Used exclusively for delete operations via Server Actions.
 * Never import this file in client components.
 *
 * Upload is handled client-side via CldUploadWidget (next-cloudinary).
 */
import { v2 } from "cloudinary";
import environment from "@/config/environment.config";

const {
  cloudinary: { cloudName, apiKey, apiSecret },
} = environment;

v2.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { v2 as cloudinary } from "cloudinary";
