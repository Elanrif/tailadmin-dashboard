"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";

import Button from "@/components/ui/button/Button";
import { UnifiedPagination } from "@/components/ui/paginations";
import { useModal } from "@/hooks/useModal";

import { postsQueryOptions } from "@/lib/posts/api/queries/queries.client";
import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";
import { exportToCSV } from "@/lib/utils";
import { usePaginationParams } from "@/lib/use-pagination-params";

import { commentKeys } from "../api/queries";
import { commentsQueryOptions } from "../api/queries/queries.client";
import { deleteCommentMutation } from "../api/mutations";
import { Comment } from "../api/types";

import { Filters } from "./ui/comments-table/filters";
import { Columns } from "./ui/comments-table/columns";
import { Row } from "./ui/comments-table/row";
import { Modals } from "./ui/comments-table/modals";
import { useCommentFilters } from "./ui/comments-table/use-filters";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type CommentsQueryProps = {
  // Optional parameters provided by the parent to scope the comments.
  queryParams?: {
    postId?: number;
    authorId?: number;
  };
};

export function Comments({ queryParams }: CommentsQueryProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const { currentPage, itemsPerPage, handlePageChange, handleSizeChange } =
    usePaginationParams({
      pageParam: "page",
      sizeParam: "size",
      defaultPage: 1,
      defaultSize: 5,
    });

  const {
    filters,
    searchQuery,
    authorId,
    postId,
    handleSearch,
    handleFilterChange,
  } = useCommentFilters({
    currentPage,
    itemsPerPage,
    postID: queryParams?.postId,
    onPageReset: () => handlePageChange(1),
  });

  const { data } = useSuspenseQuery(commentsQueryOptions(filters));
  const comments = data.ok ? data.data.data : [];
  const meta = data.ok ? data.data.meta : null;

  const { data: usersResult } = useSuspenseQuery(
    usersQueryOptions({ size: 1000 }),
  );
  const { data: postsResult } = useSuspenseQuery(
    postsQueryOptions({ size: 1000 }),
  );
  const authors = usersResult.ok ? usersResult.data.data : [];
  const posts = postsResult.ok ? postsResult.data.data : [];

  const { data: allCommentsData } = useSuspenseQuery(
    commentsQueryOptions({ size: 1000 }),
  );

  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const deleteMutation = useMutation({
    ...deleteCommentMutation,

    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });

      toast.success("Comment deleted successfully");

      deleteModal.closeModal();
      setSelectedComment(null);

      router.refresh();
    },
  });

  const exportComments = () => {
    const rows = allCommentsData.ok ? allCommentsData.data.data : [];

    exportToCSV(
      rows.map((comment) => ({
        content: comment.content,
        author: `${comment.author?.firstName ?? ""} ${
          comment.author?.lastName ?? ""
        }`,
        postId: comment.postId,
        createdAt: comment.createdAt,
      })),
      [
        { key: "content", label: "Content" },
        { key: "author", label: "Author" },
        { key: "postId", label: "Post" },
        { key: "createdAt", label: "Created at" },
      ] as const,
      "comments.csv",
    );
  };

  const handleView = (comment: Comment) => {
    setSelectedComment(comment);
    viewModal.openModal();
  };

  const handleEdit = (comment: Comment) => {
    setSelectedComment(comment);
    editModal.openModal();
  };

  const handleDelete = (comment: Comment) => {
    setSelectedComment(comment);
    deleteModal.openModal();
  };

  const startIndex =
    meta && comments.length > 0 ? (meta.page - 1) * meta.size + 1 : 0;

  const endIndex =
    meta && comments.length > 0 ? startIndex + comments.length - 1 : 0;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Comments List</h2>

          <p className="text-sm text-gray-500">Manage your comments.</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportComments}>
            Export data
            <Download size={16} />
          </Button>

          <Button
            onClick={createModal.openModal}
            className="gap-2 bg-brand-500 hover:bg-brand-600 dark:text-white"
          >
            Add Comment
          </Button>
        </div>
      </div>

      {/* FILTERS */}
      <Filters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        authorId={authorId}
        onAuthorChange={(value) => handleFilterChange("authorId", value)}
        authors={authors}
        postId={postId}
        onPostChange={(value) => handleFilterChange("postId", value)}
        posts={posts}
        itemsPerPage={itemsPerPage}
        onLimitChange={handleSizeChange}
      />

      {/* INFO */}
      <div className="text-sm text-gray-500">
        Showing {startIndex} to {endIndex} of {meta?.total ?? 0} comments
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <Table>
          <TableHeader className="text-start bg-green-600 text-white border-b border-gray-100 dark:border-white/5">
            <Columns />
          </TableHeader>

          <TableBody>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Row
                  key={comment.id}
                  comment={comment}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-gray-500"
                >
                  No comments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {meta && (
        <UnifiedPagination
          mode="server"
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={meta.size}
          onPageChange={handlePageChange}
          variant="both"
        />
      )}

      {/* MODALS */}
      {/* 
      Optional queryParams scope the create/edit forms and hide the
      corresponding select fields.
      When omitted, the related fields remain
      available for selection.
      */}
      <Modals
        selectedComment={selectedComment}
        postId={postId}
        authorId={authorId}
        modals={{
          view: {
            isOpen: viewModal.isOpen,
            close: viewModal.closeModal,
          },
          edit: {
            isOpen: editModal.isOpen,
            close: editModal.closeModal,
          },
          create: {
            isOpen: createModal.isOpen,
            close: createModal.closeModal,
          },
          delete: {
            isOpen: deleteModal.isOpen,
            close: deleteModal.closeModal,
          },
        }}
        onConfirmDelete={() =>
          selectedComment && deleteMutation.mutate(selectedComment.id)
        }
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
