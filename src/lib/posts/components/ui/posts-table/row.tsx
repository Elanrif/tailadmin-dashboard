"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { Post } from "../../../api/types";
import { CellActions } from "./cell-action";
import Image from "next/image";
import { useImageZoom } from "@/lib/shared/cloudinary/hooks/use-image-zoom";
import { ImageZoomModal } from "@/lib/shared/cloudinary/components/image-zoom-modal";

export function Row({
  post,
  onEdit,
  onDelete,
  detailsPath,
}: {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  detailsPath?: string;
}) {
  const { previewImage, openZoom, closeZoom } = useImageZoom();

  const cells = [
    post.description?.length > 20
      ? `${post.description.slice(0, 20)}...`
      : post.description,
    post.author ? `${post.author.firstName} ${post.author.lastName}` : "—",
    <Badge key="comments" size="sm" color="light">
      {post.numberOfComments || 0}
    </Badge>,
    <Badge key="likes" size="sm" color="primary">
      {post.likes}
    </Badge>,
    new Date(post.createdAt).toLocaleDateString(),
  ];

  return (
    <TableRow className="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-900 dark:even:bg-gray-800/60">
      <TableCell className="px-4 py-3 text-center align-middle text-theme-sm text-gray-500 dark:text-gray-400">
        {post.id}
      </TableCell>
      <TableCell className="px-4 py-3 text-center align-middle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={!post.imageUrl}
            onClick={() =>
              post.imageUrl &&
              openZoom(post.imageUrl, post.title || "Image du post")
            }
            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 disabled:cursor-default enabled:cursor-zoom-in"
            aria-label={
              post.imageUrl
                ? `Afficher l'image du post ${post.title || "en grand"}`
                : undefined
            }
          >
            {post.imageUrl ? (
              <Image
                width={56}
                height={56}
                src={post.imageUrl}
                alt={post.title ? `${post.title.slice(0, 7)} image` : "Post"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {post.title?.slice(0, 2).toUpperCase() || "N/A"}
              </span>
            )}
          </button>
          <ImageZoomModal image={previewImage} onClose={closeZoom} />
          <span className="font-medium text-gray-800 dark:text-white/90">
            {post.title?.length > 20
              ? `${post.title.slice(0, 20)}...`
              : post.title}
          </span>
        </div>
      </TableCell>
      {cells.map((cell, index) => (
        <TableCell
          key={index}
          className="px-4 py-3 text-center align-middle text-theme-sm text-gray-500 dark:text-gray-400"
        >
          {cell}
        </TableCell>
      ))}

      {/* Actions */}
      <TableCell className="px-4 py-3 text-center align-middle">
        <CellActions
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          detailsPath={detailsPath}
        />
      </TableCell>
    </TableRow>
  );
}
