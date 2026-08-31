"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { useSession } from "@/lib/auth/components/auth.context";

import { postsQueryOptions } from "@/lib/posts/api/queries/queries.client";
import { postKeys } from "@/lib/posts/api/queries";
import { deletePostMutation } from "@/lib/posts/api/mutations";

import type { Post } from "@/lib/posts/api/types";
import { Modals } from "@/lib/posts/components/ui/posts-table/modals";
import Comments from "./comments";

export default function Posts() {
  const { user, isLoading } = useSession();
  const queryClient = useQueryClient();

  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  /* Modals */
  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const { data: postsResult } = useSuspenseQuery(
    postsQueryOptions({ size: 1000 }),
  );

  const posts = postsResult.ok ? postsResult.data.data : [];

  const deleteMutation = useMutation({
    ...deletePostMutation,

    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });
      toast.success("Post supprimé");

      deleteModal.closeModal();
      setSelectedPost(null);
    },
  });

  const isPostOwner = (post: Post) => user?.id === post.author?.id;

  const openPostEdit = (post: Post) => {
    setSelectedPost(post);
    editModal.openModal();
  };

  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">
            Le Feuilleton
          </p>

          <h1 className="font-serif text-3xl font-semibold text-stone-900 dark:text-stone-100">
            Posts & commentaires
          </h1>
        </div>

        {!isLoading && user && (
          <Button
            size="sm"
            variant="outline"
            startIcon={<Plus size={16} />}
            onClick={createModal.openModal}
          >
            Nouveau post
          </Button>
        )}
      </div>

      <div className="divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
        {posts.map((post: Post) => {
          const isExpanded = expandedPost === post.id;
          const owner = isPostOwner(post);

          return (
            <article
              key={post.id}
              className="my-8 bg-[#faf8f3] px-0 py-8 dark:bg-slate-950 sm:px-6"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {post.imageUrl && (
                  <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-xl bg-stone-200 sm:h-32 sm:w-44">
                    <Image
                      src={post.imageUrl}
                      alt={post.title || "Image du post"}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={post.author?.avatarUrl}
                        name={`${post.author?.firstName ?? ""} ${
                          post.author?.lastName ?? ""
                        }`}
                      />

                      <div>
                        <p className="text-sm text-stone-500">
                          {post.author?.firstName} {post.author?.lastName}
                          <span className="mx-2">·</span>
                          {new Date(post.createdAt).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )}
                        </p>

                        <h2 className="font-serif text-2xl font-semibold leading-tight text-stone-900 dark:text-stone-100">
                          {post.title}
                        </h2>
                      </div>
                    </div>

                    {owner && (
                      <div className="group relative shrink-0">
                        <button
                          type="button"
                          className="rounded-full p-2 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800"
                          aria-label="Options du post"
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        <div className="invisible absolute right-0 top-10 z-10 w-36 rounded-lg border border-stone-200 bg-white p-1 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 dark:border-stone-700 dark:bg-stone-900">
                          <button
                            type="button"
                            onClick={() => openPostEdit(post)}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800"
                          >
                            <Pencil size={14} />
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPost(post);
                              deleteModal.openModal();
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 whitespace-pre-line font-serif text-lg leading-8 text-stone-700 dark:text-stone-300">
                    {post.description}
                  </p>

                  <div className="mt-6 flex items-center gap-6 border-t border-stone-200 pt-4 text-sm text-stone-500 dark:border-stone-800">
                    <span className="inline-flex items-center gap-2">
                      <Heart size={17} />
                      {post.likes}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPost(isExpanded ? null : post.id)
                      }
                      className="inline-flex items-center gap-2 hover:text-stone-900 dark:hover:text-stone-100"
                    >
                      <MessageSquare size={17} />
                      {(post.commentSize as number) > 0
                        ? `${post.commentSize} commentaire${(post.commentSize as number) > 1 ? "s" : ""}`
                        : `Aucun commentaire`}
                      {isExpanded ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      )}
                    </button>

                    {user && (
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedPost(post.id);
                        }}
                        className="ml-auto inline-flex items-center gap-2 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        <Plus size={17} />
                        Commenter
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <Comments
                      queryParams={{ postId: post.id, 
                        authorId: user?.id }}
                    />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Modals
        selectedPost={selectedPost}
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
    </section>
  );
}

function Avatar({ src, name }: { src?: string; name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-700 text-xs font-semibold text-white">
      {src ? (
        <Image
          src={src}
          alt={name || "Avatar utilisateur"}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        initials || "?"
      )}
    </div>
  );
}
