"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/lib/auth/components/auth.context";
import { postsQueryOptions } from "@/lib/posts/api/queries/queries.client";
import { deletePostMutation } from "@/lib/posts/api/mutations";
import type { Post } from "@/lib/posts/api/types";
import { Modals } from "@/lib/posts/components/ui/posts-table/modals";
import Comments from "./comments";
import environment from "@/config/environment.config";
import { EmptyState } from "@/lib/shared/ui/empty-state";
import { useImageZoom } from "@/lib/shared/cloudinary/hooks/use-image-zoom";
import { ImageZoomModal } from "@/lib/shared/cloudinary/components/image-zoom-modal";

const POST_PREVIEW_LENGTH_DESKTOP = 220;
const POST_PREVIEW_LENGTH_MOBILE = 120;

const formatPostDescription = (description: string) =>
  description
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\s*\r?\n\s*/g, " ").trim())
    .join("\n\n");

export default function Posts() {
  const { user, isLoading } = useSession();
  const isMobile = useIsMobile();
  const postPreviewLength = isMobile
    ? POST_PREVIEW_LENGTH_MOBILE
    : POST_PREVIEW_LENGTH_DESKTOP;
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [expandedContentPost, setExpandedContentPost] = useState<number | null>(
    null,
  );
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { previewImage, openZoom, closeZoom } = useImageZoom();

  /* Modals */
  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const createModalComment = useModal();
  const deleteModal = useModal();

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

  const isPostOwner = (post: Post) => user?.id === post.author?.id;

  const openPostEdit = (post: Post) => {
    setSelectedPost(post);
    editModal.openModal();
  };

  const { data } = useSuspenseQuery(
    postsQueryOptions({ size: environment.pagination.size }),
  );
  const posts = data.content;

  return (
    <section className="mx-auto w-full max-w-3xl px-4 sm:px-0">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
            <span className="hidden sm:inline">Nouveau post</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        )}
      </div>

      <div className="divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
        {posts.length > 0 ? (
          <>
            {posts.map((post: Post) => {
              const isExpanded = expandedPost === post.id;
              const isContentExpanded = expandedContentPost === post.id;
              const formattedDescription = formatPostDescription(
                post.description,
              );
              const hasLongDescription =
                formattedDescription.length > postPreviewLength;
              const description =
                isContentExpanded || !hasLongDescription
                  ? formattedDescription
                  : `${formattedDescription.slice(0, postPreviewLength).trimEnd()}…`;
              const owner = isPostOwner(post);

              return (
                <article
                  key={post.id}
                  className="my-8 bg-[#faf8f3] px-1 py-8 dark:bg-slate-950 sm:px-6"
                >
                  <div className="flex flex-col gap-6">
                    <div className="w-full min-w-0 px-5 sm:px-0">
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-stone-700 text-[10px] font-semibold text-white sm:h-10 sm:w-10 sm:text-xs">
                            {post.author?.avatarUrl ? (
                              <Image
                                src={post.author.avatarUrl}
                                alt={`${post.author?.firstName ?? ""} ${
                                  post.author?.lastName ?? ""
                                }`}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              `${post.author?.firstName?.[0] ?? ""}${
                                post.author?.lastName?.[0] ?? ""
                              }`.toUpperCase() || "?"
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs text-stone-500 sm:text-sm">
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

                            <h2
                              className="wrap-break-word font-serif text-sm font-semibold
                             leading-tight text-stone-900 dark:text-stone-100 sm:text-xl"
                            >
                              {post.title}
                            </h2>
                          </div>
                        </div>

                        {owner && (
                          <div className="group relative shrink-0">
                            <button
                              type="button"
                              className="rounded-full p-1.5 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 sm:p-2"
                              aria-label="Options du post"
                            >
                              <MoreHorizontal className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </button>
                            <div className="invisible absolute right-0 top-10 z-10 w-32 rounded-lg border border-stone-200 bg-white p-1 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 dark:border-stone-700 dark:bg-stone-900 sm:w-36">
                              <button
                                type="button"
                                onClick={() => openPostEdit(post)}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs hover:bg-stone-100 dark:hover:bg-stone-800 sm:text-sm"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Modifier
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPost(post);
                                  deleteModal.openModal();
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 sm:text-sm"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <p
                        className="mt-4 wrap-break-word whitespace-pre-line font-serif text-sm
                       leading-7 text-stone-700 dark:text-stone-300 sm:text-lg sm:leading-8"
                      >
                        {description}
                      </p>

                      {hasLongDescription && (
                        <button
                          type="button"
                          aria-expanded={isContentExpanded}
                          onClick={() =>
                            setExpandedContentPost(
                              isContentExpanded ? null : post.id,
                            )
                          }
                          className="mt-2 inline-flex items-center gap-1 text-sm
                           text-blue-600 underline-offset-4 hover:text-blue-900 hover:underline
                            dark:text-stone-400 dark:hover:text-stone-100"
                        >
                          {isContentExpanded ? (
                            <>
                              Réduire
                              <ChevronsUp
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </>
                          ) : (
                            <>
                              Lire la suite
                              <ChevronsDown
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {post.imageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          openZoom(
                            post.imageUrl!,
                            post.title || "Image du post",
                          )
                        }
                        aria-label={`Afficher l'image du post ${post.title || "en grand"}`}
                        className="relative h-56 w-full cursor-zoom-in overflow-hidden rounded-xl bg-stone-200 text-left sm:h-96"
                      >
                        <Image
                          src={post.imageUrl}
                          alt={post.title || "Image du post"}
                          fill
                          sizes="(max-width: 640px) 100vw, 768px"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </button>
                    )}

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-stone-200 pt-4 text-xs text-stone-500 dark:border-stone-800 sm:gap-x-4 sm:gap-6 sm:text-sm">
                      <span className="inline-flex items-center gap-1.5 sm:gap-2">
                        <Heart className="h-4 w-4 sm:h-4.25 sm:w-4.25" />
                        {post.likes}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPost(isExpanded ? null : post.id)
                        }
                        className="inline-flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100 sm:gap-2"
                      >
                        <MessageSquare className="h-4 w-4 sm:h-4.25 sm:w-4.25" />
                        <span className="hidden sm:inline">
                          {(post.numberOfComments as number) > 0
                            ? `${post.numberOfComments} commentaire${(post.numberOfComments as number) > 1 ? "s" : ""}`
                            : "Aucun commentaire"}
                        </span>
                        <span className="sm:hidden">
                          {post.numberOfComments as number}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-3.5 w-3.5 sm:h-3.75 sm:w-3.75" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 sm:h-3.75 sm:w-3.75" />
                        )}
                      </button>

                      {user && (
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedPost(post.id);
                            createModalComment.openModal();
                          }}
                          className="ml-auto inline-flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-100 sm:gap-2"
                        >
                          <Plus className="h-4 w-4 sm:h-4.25 sm:w-4.25" />
                          <span className="hidden sm:inline">Commenter</span>
                        </button>
                      )}
                    </div>

                    {isExpanded && (
                      <Comments
                        queryParams={{ postId: post.id, authorId: user?.id }}
                        action={createModalComment}
                      />
                    )}
                  </div>
                </article>
              );
            })}
          </>
        ) : (
          <EmptyState
            title="Aucun post trouvé"
            description="Il n'y a aucun post à afficher pour le moment."
          />
        )}
      </div>
      {/*
      Optional queryParams scope the create/edit forms and hide the
      corresponding select fields.
      When omitted, the related fields remain
      available for selection.
      */}
      <Modals
        selectedPost={selectedPost}
        hiddenFields={{ authorId: user?.id }}
        modals={{
          view: { isOpen: viewModal.isOpen, close: viewModal.closeModal },
          edit: { isOpen: editModal.isOpen, close: editModal.closeModal },
          create: { isOpen: createModal.isOpen, close: createModal.closeModal },
          delete: { isOpen: deleteModal.isOpen, close: deleteModal.closeModal },
        }}
        onConfirmDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
      <ImageZoomModal image={previewImage} onClose={closeZoom} />
    </section>
  );
}
