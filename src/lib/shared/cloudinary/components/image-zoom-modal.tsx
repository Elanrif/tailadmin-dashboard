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
      className="max-h-[95vh] max-w-6xl bg-black/95 p-3 sm:p-6"
    >
      {image && (
        <div className="relative h-[75vh] w-[calc(100vw-2rem)] max-w-6xl sm:h-[85vh] sm:w-[min(90vw,72rem)]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="90vw"
            quality={100}
            className="object-contain"
          />
        </div>
      )}
    </Modal>
  );
}
