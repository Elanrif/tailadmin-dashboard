"use client";

import { useState } from "react";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Upload, Loader2, Images, Trash2Icon } from "lucide-react";
import { deleteImageAction } from "@/lib/shared/cloudinary/cloudinary.actions";
import environment from "@/config/environment.config";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UploadedImage = {
  publicId: string;
  url: string;
};

type BaseProps = {
  folder?: string;
  variant?: "dark" | "light";
  className?: string; // Pour contrôler la hauteur/largeur du conteneur
  textSize?: string; // Pour contrôler la taille du texte dans la zone de drop
  imageClassName?: string; // Pour contrôler le style de l'image
};

type SingleProps = BaseProps & {
  multiple?: false;
  value?: string;
  publicId?: string;
  onChange: (url: string, publicId: string) => void;
  onRemove?: () => void;
};

type MultipleProps = BaseProps & {
  multiple: true;
  values?: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
};

type ImageUploadProps = SingleProps | MultipleProps;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  dark: {
    zone: "border-white/20 hover:border-white/40 bg-white/5",
    icon: "text-white/30",
    text: "text-white/40",
    subtext: "text-white/25",
  },
  light: {
    zone: "border-gray-300 hover:border-gray-400 bg-gray-50",
    icon: "text-gray-400",
    text: "text-gray-500",
    subtext: "text-gray-400",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

const { cloudinary } = environment;

export function ImageUpload(props: ImageUploadProps) {
  const {
    folder,
    variant = "light",
    className,
    imageClassName,
    textSize = "text-md",
  } = props;
  const [deleting, setDeleting] = useState<string | null>(null);
  const s = styles[variant];

  const uploadFolder = folder ?? cloudinary.uploadFolder;

  // ── Single mode ──────────────────────────────────────────────────────────

  if (!props.multiple) {
    const { value, publicId, onChange, onRemove } = props;

    async function handleRemove() {
      if (!publicId) {
        onRemove?.();
        return;
      }
      setDeleting(publicId);
      await deleteImageAction(publicId);
      setDeleting(null);
      onRemove?.();
    }

    function handleUploadSuccess(
      result: CloudinaryUploadWidgetResults,
      { widget }: { widget: any },
    ) {
      if (result.event !== "success" || typeof result.info !== "object") return;
      const info = result.info as { public_id: string; secure_url: string };
      widget?.close?.();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      if (publicId) deleteImageAction(publicId);
      onChange(info.secure_url, info.public_id);
    }

    return (
      <div className={cn("space-y-2", className)}>
        {value ? (
          <div className="relative">
            <div
              className={cn(
                "relative w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm",
                imageClassName || "h-40", // hauteur par défaut si non spécifiée
              )}
            >
              {publicId ? (
                <CldImage
                  src={publicId}
                  alt="Image"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={value}
                  alt="Image"
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            {/* Boutons positionnés en absolute par rapport au conteneur */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={!!deleting}
              className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center
                rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Trash2Icon size={16} />
              )}
            </button>

            <CldUploadWidget
              uploadPreset={cloudinary.uploadPreset}
              options={{
                folder: uploadFolder,
                maxFiles: 1,
                resourceType: "image",
              }}
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="mt-2 flex items-center gap-1.5 text-sm text-gray-500
                    hover:text-gray-700"
                >
                  <Upload size={16} />
                  Mettre à jour l&apos;image
                </button>
              )}
            </CldUploadWidget>
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset={cloudinary.uploadPreset}
            options={{
              folder: uploadFolder,
              maxFiles: 1,
              resourceType: "image",
            }}
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className={cn(
                  "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed transition",
                  s.zone,
                  imageClassName || "h-40", // hauteur par défaut
                  className,
                )}
              >
                <Upload size={24} className={s.icon} />
                <span className={cn("mt-2", props.textSize, s.text)}>
                  Veuillez choisir une image
                </span>
                <span className={cn("text-[12px]", s.subtext)}>
                  JPG, PNG, WebP
                </span>
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>
    );
  }

  // ── Multiple mode ─────────────────────────────────────────────────────────

  const { values = [], onChange } = props;

  async function handleRemoveMultiple(publicId: string) {
    setDeleting(publicId);
    await deleteImageAction(publicId);
    setDeleting(null);
    onChange(values.filter((img) => img.publicId !== publicId));
  }

  function handleUploadSuccessMultiple(result: CloudinaryUploadWidgetResults) {
    if (result.event !== "success" || typeof result.info !== "object") return;
    const info = result.info as { public_id: string; secure_url: string };
    onChange([...values, { publicId: info.public_id, url: info.secure_url }]);
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Grid of uploaded images */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {values.map((img) => (
            <div key={img.publicId} className="relative w-full max-w-[150px]">
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm",
                  imageClassName || "h-32",
                )}
              >
                <CldImage
                  src={img.publicId}
                  alt="Image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 150px) 100vw, 150px"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMultiple(img.publicId)}
                disabled={deleting === img.publicId}
                className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center
                  rounded-full bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-50"
              >
                {deleting === img.publicId ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Trash2Icon size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <CldUploadWidget
        uploadPreset={cloudinary.uploadPreset}
        options={{
          folder: uploadFolder,
          multiple: true,
          resourceType: "image",
        }}
        onSuccess={handleUploadSuccessMultiple}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className={cn(
              "flex w-full max-w-[150px] flex-col items-center justify-center rounded-xl border-2 border-dashed transition",
              s.zone,
              imageClassName || "h-32",
            )}
          >
            <Images size={24} className={s.icon} />
            <span className={cn("mt-2 text-xs", s.text)}>Ajouter</span>
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
