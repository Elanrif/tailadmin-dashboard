"use client";

import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Comment } from "@/lib/comments/api/types";
import CommentFormView from "../../comment-form-view";

export function Modals({
  selectedComment,
  modals,
  onConfirmDelete,
  isDeleting,
}: {
  selectedComment: Comment | null;
  modals: {
    view: { isOpen: boolean; close: () => void };
    edit: { isOpen: boolean; close: () => void };
    create: { isOpen: boolean; close: () => void };
    delete: { isOpen: boolean; close: () => void };
  };
  onConfirmDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <>
      <Modal
        isOpen={modals.view.isOpen}
        onClose={modals.view.close}
        className="max-w-3xl p-6 lg:p-10"
      >
        {selectedComment && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Comment details</h3>
            <p>{selectedComment.content}</p>
            <p className="text-sm text-gray-500">
              Post #{selectedComment.postId}
            </p>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={modals.create.isOpen}
        onClose={modals.create.close}
        className="max-h-[90vh] max-w-4xl overflow-y-auto p-6 lg:p-10"
      >
        <CommentFormView commentId="new" onSaved={modals.create.close} />
      </Modal>
      <Modal
        isOpen={modals.edit.isOpen}
        onClose={modals.edit.close}
        className="max-h-[90vh] max-w-4xl overflow-y-auto p-6 lg:p-10"
      >
        {selectedComment && (
          <CommentFormView
            commentId={String(selectedComment.id)}
            onSaved={modals.edit.close}
          />
        )}
      </Modal>
      <Modal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.close}
        className="max-w-md p-6 lg:p-10"
      >
        <div className="space-y-4 text-center">
          <Trash2 className="mx-auto h-10 w-10 text-error-500" />
          <h3 className="text-xl font-semibold">Delete comment</h3>
          <p className="text-gray-500">
            Are you sure you want to delete this comment?
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={modals.delete.close}>
              Cancel
            </Button>
            <Button
              className="bg-error-600"
              onClick={onConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
