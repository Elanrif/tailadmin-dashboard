"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UnifiedPagination } from "@/components/ui/paginations";
import { useModal } from "@/hooks/useModal";
import { Table, TableBody, TableHeader } from "@/components/ui/table";

import { postsQueryOptions } from "@/lib/posts/api/queries/queries.client";
import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";
import { exportToCSV } from "@/lib/utils";
import { usePageQuery } from "@/lib/use-page-query";
import { commentsQueryOptions } from "../api/queries/queries.client";
import { deleteCommentMutation } from "../api/mutations";
import { Comment } from "../api/types";

import { Filters } from "./ui/comments-table/filters";
import { Columns } from "./ui/comments-table/columns";
import { Row } from "./ui/comments-table/row";
import { Modals } from "./ui/comments-table/modals";
import { useCommentFilters } from "./ui/comments-table/use-filters";
import { EmptyState } from "@/lib/shared/ui/empty-state";
import environment from "@/config/environment.config";

export type CommentsQueryProps = {
  queryParams?: {
    postId?: number;
    authorId?: number;
  };
};

const {
  pagination: { page, size },
  export: { maxSize: MAX_EXPORT_SIZE },
} = environment;

export function Comments({ queryParams }: CommentsQueryProps) {
  const queryClient = useQueryClient();
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const { currentPage, itemsPerPage, handlePageChange, handleSizeChange } =
    usePageQuery({
      pageParam: "page",
      sizeParam: "size",
      defaultPage: page,
      defaultSize: size,
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
  const { data: usersResult } = useSuspenseQuery(usersQueryOptions({ size }));
  const { data: postsResult } = useSuspenseQuery(postsQueryOptions({ size }));

  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();
  const deleteMutation = useMutation(deleteCommentMutation);

  const openWith = (modal: ReturnType<typeof useModal>) => (item: Comment) => {
    setSelectedComment(item);
    modal.openModal();
  };

  const handleDelete = async () => {
    if (!selectedComment) return;
    deleteMutation.mutate(selectedComment.id, {
      onSuccess: () => {
        toast.success("Comment deleted successfully");
        deleteModal.closeModal();
        setSelectedComment(null);
      },
      onError: (error) => {
        if (error.status === 401) {
          toast.error("Votre session a expiré, veuillez vous reconnecter.");
          return;
        }
        toast.error(error.message);
      },
    });
  };

  const exportComments = async () => {
    const result = await queryClient.fetchQuery(
      commentsQueryOptions({ size: MAX_EXPORT_SIZE }),
    );
    const rows = result.content;

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

  const comments = data.content;
  const pagination = data;

  const authors = usersResult.content;
  const posts = postsResult.content;

  const startIndex =
    comments.length > 0 ? (pagination.page - 1) * pagination.size + 1 : 0;
  const endIndex = comments.length > 0 ? startIndex + comments.length - 1 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Comments List</h2>
          <p className="text-sm text-gray-500">Manage your comments.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={exportComments}>
            Export <Download size={16} />
          </Button>
          <Button
            onClick={() => createModal.openModal()}
            className="gap-2 bg-brand-500 hover:bg-brand-600 dark:text-white"
          >
            Add Comment
          </Button>
        </div>
      </div>

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
      <div className="text-sm text-gray-500">
        Showing {startIndex} to {endIndex} of {pagination.total} comments
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          {comments.length > 0 ? (
            <Table>
              <TableHeader className="text-start bg-brand-500 text-white border-b border-gray-100 dark:border-white/5">
                <Columns />
              </TableHeader>
              <TableBody>
                {comments.map((comment) => (
                  <Row
                    key={comment.id}
                    comment={comment}
                    onView={openWith(viewModal)}
                    onEdit={openWith(editModal)}
                    onDelete={openWith(deleteModal)}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="Aucun commentaire"
              description="Aucun commentaire ne correspond à ces critères pour le moment."
              fullWidth={false}
              className="border-0 bg-transparent"
            />
          )}
        </div>
      </div>

      <UnifiedPagination
        mode="server"
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.size}
        onPageChange={handlePageChange}
        variant="both"
      />

      <Modals
        selectedComment={selectedComment}
        hiddenFields={{ authorId, postId }}
        modals={{
          view: { isOpen: viewModal.isOpen, close: viewModal.closeModal },
          edit: { isOpen: editModal.isOpen, close: editModal.closeModal },
          create: { isOpen: createModal.isOpen, close: createModal.closeModal },
          delete: { isOpen: deleteModal.isOpen, close: deleteModal.closeModal },
        }}
        onConfirmDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
