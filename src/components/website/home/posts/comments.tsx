"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { useModal } from "@/hooks/useModal";
import { useSession } from "@/lib/auth/components/auth.context";
import { commentsQueryOptions } from "@/lib/comments/api/queries/queries.client";
import { deleteCommentMutation } from "@/lib/comments/api/mutations";
import { Comment } from "@/lib/comments/api/types";
import { Modals } from "@/lib/comments/components/ui/comments-table/modals";
import { CommentsQueryProps } from "@/lib/comments/components/comments";
import environment from "@/config/environment.config";

export default function Comments({
  queryParams,
  action,
}: CommentsQueryProps & {
  action: {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
  };
}) {
  const { user } = useSession();
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const viewModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const deleteMutation = useMutation(deleteCommentMutation);
  const handleDelete = () => {
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

  const isCommentOwner = (comment: Comment) => user?.id === comment.author?.id;

  const handleEdit = (comment: Comment) => {
    setSelectedComment(comment);
    setOpenMenuId(null);
    editModal.openModal();
  };

  const handleDeleteComment = (comment: Comment) => {
    setSelectedComment(comment);
    setOpenMenuId(null);
    deleteModal.openModal();
  };

  const { data } = useSuspenseQuery(
    commentsQueryOptions({
      postId: queryParams?.postId,
      size: environment.pagination.size,
    }),
  );

  const comments = data.content;

  return (
    <>
      <div className="mt-6 space-y-4 border-l border-stone-300 pl-4 dark:border-stone-700">
        <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
          Commentaires
        </h3>

        {comments.length > 0 ? (
          comments.map((comment) => {
            const owner = isCommentOwner(comment);
            const isMenuOpen = openMenuId === comment.id;

            return (
              <div
                key={comment.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar
                    src={comment.author?.avatarUrl}
                    name={`${comment.author?.firstName ?? ""} ${
                      comment.author?.lastName ?? ""
                    }`}
                  />

                  <div>
                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                      {comment.author?.firstName} {comment.author?.lastName}
                      <span className="ml-2 font-normal text-stone-400">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </span>
                    </p>

                    <p className="mt-1 font-serif text-base leading-7 text-stone-700 dark:text-stone-300">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {owner && (
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(isMenuOpen ? null : comment.id)
                      }
                      className="rounded-full p-1.5 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800"
                      aria-label="Options du commentaire"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {isMenuOpen && (
                      <>
                        {/* Backdrop to close the menu on outside click/tap */}
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-9 z-20 w-36 rounded-lg border border-stone-200 bg-white p-1 shadow-lg dark:border-stone-700 dark:bg-stone-900">
                          <button
                            type="button"
                            onClick={() => handleEdit(comment)}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800"
                          >
                            <Pencil size={14} />
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteComment(comment)}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center">
            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-stone-300 dark:text-stone-600" />
            <p className="text-sm italic text-stone-500">
              Aucun commentaire pour le moment.
            </p>
          </div>
        )}
      </div>

      <Modals
        selectedComment={selectedComment}
        hiddenFields={{
          postId: queryParams?.postId,
          authorId: queryParams?.authorId,
        }}
        modals={{
          view: { isOpen: viewModal.isOpen, close: viewModal.closeModal },
          edit: { isOpen: editModal.isOpen, close: editModal.closeModal },
          create: { isOpen: action.isOpen, close: action.closeModal },
          delete: { isOpen: deleteModal.isOpen, close: deleteModal.closeModal },
        }}
        onConfirmDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </>
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
