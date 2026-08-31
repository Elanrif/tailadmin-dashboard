"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Address } from "@/lib/addresses/api/types";
import AddressFormView from "../../address-form-view";
import AddressDetails from "../../address-details";

interface ModalState {
  isOpen: boolean;
  close: () => void;
}

interface AddressModalsProps {
  userId?: number;
  selectedAddress: Address | null;
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
  userId,
  selectedAddress,
  modals,
  onConfirmDelete,
  isDeleting,
}: AddressModalsProps) {
  return (
    <>
      {/* View Details */}
      <Modal
        isOpen={modals.view.isOpen}
        onClose={modals.view.close}
        className="max-w-2xl p-6 lg:p-10"
      >
        {selectedAddress && <AddressDetails addressId={selectedAddress.id} />}
      </Modal>

      {/* Create */}
      <Modal
        isOpen={modals.create.isOpen}
        onClose={modals.create.close}
        className="relative max-w-4xl p-6 lg:p-10 max-h-[90vh] overflow-y-auto"
      >
        <AddressFormView
          addressId="new"
          userId={userId}
          onSaved={modals.create.close}
        />
      </Modal>

      {/* Edit */}
      <Modal
        isOpen={modals.edit.isOpen}
        onClose={modals.edit.close}
        className="relative max-w-4xl p-6 lg:p-10 max-h-[90vh] overflow-y-auto"
      >
        <AddressFormView
          addressId={selectedAddress ? String(selectedAddress.id) : "new"}
          userId={userId}
          onSaved={modals.edit.close}
        />
      </Modal>

      {/* Delete */}
      <Modal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.close}
        className="max-w-md p-6 lg:p-10"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/20">
            <Trash2 className="h-6 w-6 text-error-600 dark:text-error-400" />
          </div>

          <h3 className="text-xl font-semibold">Delete Address</h3>

          <p className="text-gray-500 dark:text-gray-400">
            Are you sure you want to delete the address:
            <br />
            <strong>{selectedAddress?.street}</strong> ?
          </p>

          <div className="flex justify-center gap-3">
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
