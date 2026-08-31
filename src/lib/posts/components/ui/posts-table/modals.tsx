"use client";

import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import PostDetails from "../../post-details";
import PostFormView from "../../post-form-view";
import { Post } from "@/lib/posts/api/types";

export function Modals({
  selectedPost,
  modals,
  onConfirmDelete,
  isDeleting,
}: {
  selectedPost: Post | null;
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
      {/* View Details */}
      <Modal
        isOpen={modals.view.isOpen}
        onClose={modals.view.close}
        className="max-h-[90vh] max-w-4xl p-0"
      >
        {selectedPost && <PostDetails postId={selectedPost.id} />}
      </Modal>

      {/* Create Post */}
      <Modal
        isOpen={modals.create.isOpen}
        onClose={modals.create.close}
        className="max-h-[90vh] max-w-4xl p-0"
      >
        <PostFormView postId="new" onSaved={modals.create.close} />
      </Modal>

      {/* Edit Post */}
      <Modal
        isOpen={modals.edit.isOpen}
        onClose={modals.edit.close}
        className="max-h-[90vh] max-w-4xl p-0"
      >
        {selectedPost && (
          <PostFormView
            postId={String(selectedPost.id)}
            onSaved={modals.edit.close}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.close}
        className="max-h-[90vh] max-w-4xl p-0"
      >
        <div className="space-y-4 text-center">
          <Trash2 className="mx-auto h-10 w-10 text-error-500" />
          <h3 className="text-xl font-semibold">Delete post</h3>
          <p className="text-gray-500">
            Are you sure you want to delete “{selectedPost?.title}”?
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
