// lib/shared/hooks/useImageZoom.ts
"use client";

import { useState, useCallback } from "react";
import { getCloudinaryZoomUrl } from "@/lib/shared/cloudinary/cloudinary.utils";

export type ZoomImage = { src: string; alt: string };

export function useImageZoom() {
  const [previewImage, setPreviewImage] = useState<ZoomImage | null>(null);

  const openZoom = useCallback((src: string, alt: string) => {
    setPreviewImage({ src: getCloudinaryZoomUrl(src), alt });
  }, []);

  const closeZoom = useCallback(() => setPreviewImage(null), []);

  return { previewImage, openZoom, closeZoom };
}
