"use client";

import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/users/api/types";
import UserDetails from "../../user-details";
import UserFormView from "../../user-form-view";

interface ModalState {
  isOpen: boolean;
  close: () => void;
}

interface UserModalsProps {
  selectedUser: User | null;
  modals: {
    view: ModalState;
    edit: ModalState;
    create: ModalState;
    delete: ModalState;
  };
  onConfirmDelete: () => void;
  isDeleting: boolean;
}

export function Modals({
  selectedUser,
  modals,
  onConfirmDelete,
  isDeleting,
}: UserModalsProps) {
  const getFullName = (user: User | null) =>
    user ? `${user.firstName} ${user.lastName}` : "";

  return (
    <>
      {/* Modal View */}
      <Modal
        isOpen={modals.view.isOpen}
        onClose={modals.view.close}
        className="max-h-[90vh] max-w-4xl p-0"
      >
        {selectedUser && <UserDetails userId={selectedUser.id} />}
      </Modal>

      {/* Modal Create */}
      <Modal
        isOpen={modals.create.isOpen}
        onClose={modals.create.close}
        className="max-h-[90vh] max-w-4xl p-0"
      >
        <UserFormView userId="new" onSaved={modals.create.close} />
      </Modal>

      {/* Modal Edit */}
      <Modal
        isOpen={modals.edit.isOpen}
        onClose={modals.edit.close}
        className="max-h-[90vh] max-w-4xl p-0"
      >
        <UserFormView
          userId={selectedUser ? String(selectedUser.id) : "new"}
          onSaved={modals.edit.close}
        />
      </Modal>

      {/* Modal Delete */}
      <Modal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.close}
        className="max-h-[90vh] max-w-4xl p-0"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/20">
            <Trash2 className="h-6 w-6 text-error-600 dark:text-error-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete User
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Are you sure you want to delete {getFullName(selectedUser)}? This
            action cannot be undone.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={modals.delete.close}>
              Cancel
            </Button>
            <Button
              className="bg-error-600 hover:bg-error-700"
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
