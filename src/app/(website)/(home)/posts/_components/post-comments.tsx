"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, Pencil, Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { commentsQueryOptions } from "@/lib/comments/api/queries/queries.client";
import { deleteCommentMutation } from "@/lib/comments/api/mutations";
import { commentKeys } from "@/lib/comments/api/queries";
import { Comment } from "@/lib/comments/api/types";
import CommentFormView from "@/lib/comments/components/comment-form-view";

type PostCommentsProps = {
  postId: number;
  authorId?: number;
};

export default function PostComments({ postId, authorId }: PostCommentsProps) {
  const queryClient = useQueryClient();

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const { data } = useSuspenseQuery(
    commentsQueryOptions({
      postId,
      size: 100,
    }),
  );

  const comments = data.ok ? data.data.data : [];

  const deleteMutation = useMutation({
    ...deleteCommentMutation,

    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });

      toast.success("Commentaire supprimé");

      deleteModal.closeModal();
      setSelectedComment(null);
    },
  });

  const handleEdit = (comment: Comment) => {
    setSelectedComment(comment);
    editModal.openModal();
  };

  const handleDelete = (comment: Comment) => {
    setSelectedComment(comment);
    deleteModal.openModal();
  };

  return (
    <>
      <div className="mt-6 space-y-4 border-l border-stone-300 pl-4 dark:border-stone-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Commentaires
          </h3>

          <Button
            size="sm"
            variant="outline"
            startIcon={<Plus size={15} />}
            onClick={createModal.openModal}
          >
            Commenter
          </Button>
        </div>

        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="group flex items-start justify-between gap-3"
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
                      {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </p>

                  <p className="mt-1 font-serif text-base leading-7 text-stone-700 dark:text-stone-300">
                    {comment.content}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleEdit(comment)}
                  className="rounded p-1.5 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800"
                  aria-label="Modifier le commentaire"
                  title="Modifier"
                >
                  <Pencil size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(comment)}
                  className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  aria-label="Supprimer le commentaire"
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center">
            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-stone-300 dark:text-stone-600" />

            <p className="text-sm italic text-stone-500">
              Aucun commentaire pour le moment.
            </p>
          </div>
        )}
      </div>

      {/* Create */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        className="max-h-[90vh] max-w-3xl p-6"
      >
        <CommentFormView
          commentId="new"
          postId={postId}
          authorId={authorId}
          //redirectOnSave={false}
          onSaved={createModal.closeModal}
        />
      </Modal>

      {/* Edit */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        className="max-h-[90vh] max-w-3xl p-6"
      >
        {selectedComment && (
          <CommentFormView
            commentId={String(selectedComment.id)}
            postId={postId}
            //redirectOnSave={false}
            onSaved={editModal.closeModal}
          />
        )}
      </Modal>

      {/* Delete */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-md p-6"
      >
        <ConfirmDelete
          label="ce commentaire"
          loading={deleteMutation.isPending}
          onCancel={deleteModal.closeModal}
          onConfirm={() => {
            if (selectedComment) {
              deleteMutation.mutate(selectedComment.id);
            }
          }}
        />
      </Modal>
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

function ConfirmDelete({
  label,
  loading,
  onCancel,
  onConfirm,
}: {
  label: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-5 text-center">
      <Trash2 className="mx-auto text-red-500" size={36} />

      <h3 className="text-xl font-semibold">Confirmer la suppression</h3>

      <p className="text-sm text-stone-500">
        Voulez-vous vraiment supprimer {label} ?
      </p>

      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>

        <Button variant="primary" onClick={onConfirm} disabled={loading}>
          {loading ? "Suppression…" : "Supprimer"}
        </Button>
      </div>
    </div>
  );
}
