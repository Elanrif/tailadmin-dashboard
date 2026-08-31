"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { CellActions } from "./cell-action";
import { Comment } from "@/lib/comments/api/types";

export function Row({
  comment,
  onView,
  onEdit,
  onDelete,
}: {
  comment: Comment;
  onView: (comment: Comment) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}) {
  const cells = [
    {
      key: "id",
      value: comment.id,
    },
    {
      key: "content",
      value: comment.content,
    },
    {
      key: "author",
      value: comment.author
        ? `${comment.author.firstName} ${comment.author.lastName}`
        : "—",
    },
    {
      key: "postId",
      value: `#${comment.postId}`,
    },
    {
      key: "createdAt",
      value: new Date(comment.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <TableRow className="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-900 dark:even:bg-gray-800/60">
      {cells.map((cell) => (
        <TableCell
          key={cell.key}
          className="px-4 py-3 text-center align-middle text-theme-sm text-gray-500 dark:text-gray-400"
        >
          {cell.value}
        </TableCell>
      ))}

      {/* Actions */}
      <TableCell>
        <CellActions
          comment={comment}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
