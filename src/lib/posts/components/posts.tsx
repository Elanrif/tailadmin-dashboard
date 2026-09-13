"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { postKeys } from "../api/queries";
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
import { ErrorState } from "@/lib/shared/ui/error-state";
import { EmptyState } from "@/lib/shared/ui/empty-state";
import environment from "@/config/environment.config";

export type PostQueryProps = {
  // Optional parameters provided by the parent to scope the comments.
  queryParams?: {
    authorId?: number;
  };
};

const {
  pagination: { page, size },
  export: { maxSize: MAX_EXPORT_SIZE },
} = environment;

export function Posts({ queryParams }: PostQueryProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // authorId déjà imposé par le parent (ex: page "Mes posts") → pas de
  // sélecteur d'auteurs, pas de fetch users, export limité à cet auteur.
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

  /* Modals */
  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const exportPosts = () => {
    const rows = allQuery.data.ok ? allQuery.data.data.content : [];
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

  const { data } = useSuspenseQuery(postsQueryOptions(filters));

  // Ne charge la liste des auteurs QUE si le filtre par auteur est pertinent
  // (page non scopée sur un authorId précis). Sinon, un simple USER visitant
  // "Mes posts" ne déclenche jamais /api/users (évite le 403).
  const { data: usersResult } = useQuery({
    ...usersQueryOptions({ size: MAX_EXPORT_SIZE }),
    enabled: !isAuthorScoped,
  });

  // L'export respecte le même scope que la liste affichée : un utilisateur
  // sur "Mes posts" n'exporte que ses propres posts, pas tout le monde.
  const allQuery = useSuspenseQuery(
    postsQueryOptions({
      size: MAX_EXPORT_SIZE,
      authorId: queryParams?.authorId,
    }),
  );

  if (!data?.ok) {
    return <ErrorState error={data.error} />;
  }

  const posts = data.data.content;
  const pagination = data.data;
  const authors = usersResult?.ok ? usersResult.data.content : [];

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

      {/* FILTERS : le sélecteur d'auteur ne s'affiche que si non déjà imposé */}
      {!isAuthorScoped && (
        <Filters
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          authorId={authorId}
          onAuthorChange={handleAuthorChange}
          authors={isAuthorScoped ? [] : authors}
          itemsPerPage={itemsPerPage}
          onLimitChange={handleSizeChange}
        />
      )}
      <div className="text-sm text-gray-500 dark:text-gray-400" id="table-top">
        Showing{" "}
        {posts.length ? (pagination!.page - 1) * pagination!.size + 1 : 0} to{" "}
        {posts.length
          ? (pagination!.page - 1) * pagination!.size + posts.length
          : 0}{" "}
        of {pagination?.total ?? 0} posts
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {posts.length > 0 ? (
          <Table>
            <TableHeader className="text-start bg-green-600 text-white border-b border-gray-100 dark:border-white/5">
              <Columns />
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
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

      {/* MODALS */}
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
