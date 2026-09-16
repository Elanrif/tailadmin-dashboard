"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { ZoomImage } from "../hooks/use-image-zoom";

type Props = {
  image: ZoomImage | null;
  onClose: () => void;
};

export function ImageZoomModal({ image, onClose }: Props) {
  return (
    <Modal
      isOpen={image !== null}
      onClose={onClose}
      className="max-h-[calc(100dvh-2rem)] max-w-6xl overflow-hidden bg-black/95 p-3 sm:max-h-[95dvh] sm:p-6"
    >
      {image && (
        <div className="relative mx-auto h-[70vh] max-h-[70vh] w-full sm:h-[calc(95dvh-3rem)] sm:max-h-none">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) calc(100vw - 3.5rem), (max-width: 1280px) calc(100vw - 5rem), 72rem"
            quality={100}
            className="object-contain"
          />
        </div>
      )}
    </Modal>
  );
}
