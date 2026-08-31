"use client";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Post } from "../../../api/types";
import { useRouter } from "next/navigation";

export function CellActions({
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
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="h-8 w-8 rounded-full hover:bg-blue-700/70 bg-blue-700/80 dark:hover:bg-white/70 dark:bg-white/80 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/posts/${post.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View details
        </DropdownMenuItem>
        {/* <DropdownMenuItem onClick={() => onView(post)}>
          <Eye className="mr-2 h-4 w-4" />
          View details Modals
        </DropdownMenuItem> */}
        <DropdownMenuItem onClick={() => onEdit(post)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit post
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(post)}>
          <Trash2 className="mr-2 h-4 w-4 text-error-500" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
