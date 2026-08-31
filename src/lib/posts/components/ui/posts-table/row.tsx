"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { Post } from "../../../api/types";
import { CellActions } from "./cell-action";
import Image from "next/image";

export function Row({
  post,
  onView,
  onEdit,
  onDelete,
}: {
  post: Post;
  onView: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}) {
  const cells = [
    post.description?.length > 20
      ? `${post.description.slice(0, 20)}...`
      : post.description,
    post.author ? `${post.author.firstName} ${post.author.lastName}` : "—",
    <Badge key="comments" size="sm" color="light">
      {post.commentSize || 0}
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
          <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
            {post.imageUrl ? (
              <Image
                width={112}
                height={80}
                src={post.imageUrl}
                alt={post.title ? `${post.title?.slice(0, 7)} image` : "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {post.title?.slice(0, 5) || "N/N"}
              </span>
            )}
          </div>
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
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
