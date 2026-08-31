"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UnifiedPagination } from "@/components/ui/paginations";
import { useModal } from "@/hooks/useModal";
import { exportToCSV } from "@/lib/utils";
import { Download } from "lucide-react";
import { postKeys } from "../api/queries";
import { postsQueryOptions } from "../api/queries/queries.client";
import { deletePostMutation } from "../api/mutations";
import { Filters } from "./ui/posts-table/filters";
import { Columns } from "./ui/posts-table/columns";
import { Row } from "./ui/posts-table/row";
import { Post } from "../api/types";
import { Modals } from "./ui/posts-table/modals";
import { usePaginationParams } from "@/lib/use-pagination-params";
import { usePostFilters } from "./ui/posts-table/use-filters";
import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";

export type PostQueryProps = {
  // Optional parameters provided by the parent to scope the comments.
  queryParams?: {
    authorId?: number;
  };
};

export function Posts({ queryParams }: PostQueryProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { data: usersResult } = useSuspenseQuery(
    usersQueryOptions({ size: 1000 }),
  );
  const authors = usersResult.ok ? usersResult.data.data : [];

  const { currentPage, itemsPerPage, handlePageChange, handleSizeChange } =
    usePaginationParams({
      pageParam: "page",
      sizeParam: "size",
      defaultPage: 1,
      defaultSize: 5,
    });

  const { filters, searchQuery, authorId, handleSearch, handleAuthorChange } =
    usePostFilters({
      currentPage,
      itemsPerPage,
      authorId: queryParams?.authorId,
      onPageReset: () => handlePageChange(1),
    });

  const { data } = useSuspenseQuery(postsQueryOptions(filters));
  const posts = data.ok ? data.data.data : [];
  const meta = data.ok ? data.data.meta : null;
  const allQuery = useSuspenseQuery(postsQueryOptions({ size: 1000 }));

  /* Modals */
  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const deleteMutation = useMutation({
    ...deletePostMutation,
    onSuccess: (result) => {
      if (!result.ok) return toast.error(result.error.message);
      void queryClient.invalidateQueries({ queryKey: postKeys.all });
      toast.success("Post deleted successfully");
      deleteModal.closeModal();
      setSelectedPost(null);
      router.refresh();
    },
  });

  const exportPosts = () => {
    const rows = allQuery.data.ok ? allQuery.data.data.data : [];
    exportToCSV(
      rows.map((post) => ({
        title: post.title,
        author: `${post.author?.firstName ?? ""} ${post.author?.lastName ?? ""}`,
        likes: post.likes,
        createdAt: post.createdAt,
      })),
      [
        { key: "title", label: "Title" },
        { key: "author", label: "Author" },
        { key: "likes", label: "Likes" },
        { key: "createdAt", label: "Created at" },
      ] as const,
      "posts.csv",
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Posts List</h2>
          <p className="text-sm text-gray-500">Manage your posts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPosts}>
            Export <Download size={16} />
          </Button>
          <Button
            onClick={createModal.openModal}
            className="gap-2 bg-brand-500 hover:bg-brand-600 dark:text-white"
          >
            Add Post
          </Button>
        </div>
      </div>

      {/* FILTERS */}
      <Filters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        authorId={authorId}
        onAuthorChange={handleAuthorChange}
        authors={authors}
        itemsPerPage={itemsPerPage}
        onLimitChange={handleSizeChange}
      />
      <div className="text-sm text-gray-500 dark:text-gray-400" id="table-top">
        Showing {posts.length ? (meta!.page - 1) * meta!.size + 1 : 0} to{" "}
        {posts.length ? (meta!.page - 1) * meta!.size + posts.length : 0} of{" "}
        {meta?.total ?? 0} posts
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <Table>
          <TableHeader className="text-start bg-green-600 text-white border-b border-gray-100 dark:border-white/5">
            <Columns />
          </TableHeader>
          <TableBody>
            {posts.length ? (
              posts.map((post) => (
                <Row
                  key={post.id}
                  post={post}
                  onView={(item) => {
                    setSelectedPost(item);
                    viewModal.openModal();
                  }}
                  onEdit={(item) => {
                    setSelectedPost(item);
                    editModal.openModal();
                  }}
                  onDelete={(item) => {
                    setSelectedPost(item);
                    deleteModal.openModal();
                  }}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-gray-500"
                >
                  No posts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
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
        selectedPost={selectedPost}
        hiddenFields={{ authorId }}
        modals={{
          view: { isOpen: viewModal.isOpen, close: viewModal.closeModal },
          edit: { isOpen: editModal.isOpen, close: editModal.closeModal },
          create: { isOpen: createModal.isOpen, close: createModal.closeModal },
          delete: { isOpen: deleteModal.isOpen, close: deleteModal.closeModal },
        }}
        onConfirmDelete={() =>
          selectedPost && deleteMutation.mutate(selectedPost.id)
        }
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
