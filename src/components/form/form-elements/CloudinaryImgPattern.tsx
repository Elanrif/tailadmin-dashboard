"use client";

import ComponentCard from "@/components/common/ComponentCard";
import { ImageUpload } from "@/lib/shared/cloudinary/components/image-upload";
import { useImageDraft } from "@/lib/shared/cloudinary/hooks/use-image-draft";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  avatarUrl: string;
};

export function CloudinaryImgPattern() {
  const { setValue, register, watch } = useForm<FormValues>({
    defaultValues: {
      avatarUrl: "",
    },
  });

  const image = useImageDraft({
    storageKey: "post:image",
    initialUrl: undefined,
  });

  function handleImageChange(url: string, publicId: string) {
    image.handleChange(url, publicId);
    setValue("avatarUrl", url);
  }

  function handleImageRemove() {
    image.handleRemove();
    setValue("avatarUrl", "");
  }

  return (
    <div className="space-y-6">
      <ComponentCard title="CloudinaryUpload image version 1">
        <ImageUpload
          value={image.url}
          publicId={image.publicId}
          onChange={handleImageChange}
          onRemove={handleImageRemove}
          variant="light"
        />
      </ComponentCard>

      <ComponentCard title="Cloudinary Upload image version 2">
        <ImageUpload
          value={image.url}
          imageClassName="h-50 w-50 rounded-full"
          textSize="text-xs"
          publicId={image.publicId}
          onChange={handleImageChange}
          onRemove={handleImageRemove}
          variant="light"
        />
      </ComponentCard>
    </div>
  );
}
