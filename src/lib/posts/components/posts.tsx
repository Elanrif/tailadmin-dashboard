"use client";

import { useState } from "react";
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UnifiedPagination } from "@/components/ui/paginations";
import { useModal } from "@/hooks/useModal";
import { exportToCSV } from "@/lib/utils";
import { Download } from "lucide-react";
import { postsQueryOptions } from "../api/queries/queries.client";
import { deletePostMutation } from "../api/mutations";
import { Filters } from "./ui/posts-table/filters";
import { Columns } from "./ui/posts-table/columns";
import { Row } from "./ui/posts-table/row";
import { Post } from "../api/types";
import { Modals } from "./ui/posts-table/modals";
import { usePageQuery } from "@/lib/use-page-query";
import { usePostFilters } from "./ui/posts-table/use-filters";
import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";
import { EmptyState } from "@/lib/shared/ui/empty-state";
import environment from "@/config/environment.config";

export type PostQueryProps = {
  queryParams?: {
    authorId?: number;
  };
};

const {
  pagination: { page, size },
  export: { maxSize: MAX_EXPORT_SIZE },
} = environment;

export function Posts({ queryParams }: PostQueryProps) {
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const isAuthorScoped = queryParams?.authorId != null;

  const { currentPage, itemsPerPage, handlePageChange, handleSizeChange } =
    usePageQuery({
      pageParam: "page",
      sizeParam: "size",
      defaultPage: page,
      defaultSize: size,
    });

  const { filters, searchQuery, authorId, handleSearch, handleAuthorChange } =
    usePostFilters({
      currentPage,
      itemsPerPage,
      authorId: queryParams?.authorId,
      onPageReset: () => handlePageChange(1),
    });

  const deleteMutation = useMutation(deletePostMutation);
  const handleDelete = () => {
    if (!selectedPost) return;

    deleteMutation.mutate(selectedPost.id, {
      onSuccess: () => {
        toast.success("Post supprimé");
        deleteModal.closeModal();
        setSelectedPost(null);
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

  /* Modals */
  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const openWith = (modal: ReturnType<typeof useModal>) => (item: Post) => {
    setSelectedPost(item);
    modal.openModal();
  };

  const exportPosts = async () => {
    setIsExporting(true);
    try {
      const result = await queryClient.fetchQuery(
        postsQueryOptions({ ...filters, page: 1, size: MAX_EXPORT_SIZE }),
      );

      exportToCSV(
        result.content.map((post) => ({
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
    } catch {
      toast.error("Impossible d'exporter les posts");
    } finally {
      setIsExporting(false);
    }
  };

  const { data } = useSuspenseQuery(postsQueryOptions(filters));

  const { data: usersResult } = useQuery({
    ...usersQueryOptions({ size: MAX_EXPORT_SIZE }),
    enabled: !isAuthorScoped,
  });

  const posts = data.content;
  const pagination = data;
  const authors = usersResult?.content ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Posts List</h2>
          <p className="text-sm text-gray-500">Manage your posts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={exportPosts} disabled={isExporting}>
            Export <Download size={16} />
          </Button>
          <Button
            onClick={() => createModal.openModal()}
            className="gap-2 bg-brand-500 hover:bg-brand-600 dark:text-white"
          >
            Add Post
          </Button>
        </div>
      </div>

      {!isAuthorScoped && (
        <Filters
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          authorId={authorId}
          onAuthorChange={handleAuthorChange}
          authors={authors}
          itemsPerPage={itemsPerPage}
          onLimitChange={handleSizeChange}
        />
      )}
      <div className="text-sm text-gray-500 dark:text-gray-400" id="table-top">
        Showing {posts.length ? (pagination.page - 1) * pagination.size + 1 : 0}{" "}
        to{" "}
        {posts.length
          ? (pagination.page - 1) * pagination.size + posts.length
          : 0}{" "}
        of {pagination.total} posts
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {posts.length > 0 ? (
          <Table>
            <TableHeader className="text-start bg-brand-500 text-white border-b border-gray-100 dark:border-white/5">
              <Columns />
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <Row
                  key={post.id}
                  post={post}
                  onView={openWith(viewModal)}
                  onEdit={openWith(editModal)}
                  onDelete={openWith(deleteModal)}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            title="Aucun post"
            description="Aucun post ne correspond à ces critères pour le moment."
            fullWidth={false}
            className="border-0 bg-transparent"
          />
        )}
      </div>
      {pagination && (
        <UnifiedPagination
          mode="server"
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.size}
          onPageChange={handlePageChange}
          variant="both"
        />
      )}

      <Modals
        selectedPost={selectedPost}
        hiddenFields={{ authorId }}
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
