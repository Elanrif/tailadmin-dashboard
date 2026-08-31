"use client";

import React from "react";
import { Trash, Edit } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import ChangePasswordModal from "./danger-zone/ChangePasswordModal";
import DeleteAccountModal from "./danger-zone/DeleteAccountModal";

export default function UserDangerZoneCard() {
  const {
    isOpen: isPasswordOpen,
    openModal: openPasswordModal,
    closeModal: closePasswordModal,
  } = useModal();

  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Danger Zone
          </h4>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Change Password
              </h1>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Ensure your account is using a long, random password to stay
                secure.
              </p>
            </div>
            <button
              onClick={openPasswordModal}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <Edit size={18} />
              Change Password
            </button>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Delete Account */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-sm font-medium text-gray-800 dark:text-white/90">
                Delete Account
              </h1>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <button
              onClick={openDeleteModal}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-theme-xs hover:bg-gray-50 hover:text-red-800 dark:border-gray-700 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-white/[0.03] dark:hover:text-red-200 lg:inline-flex lg:w-auto"
            >
              <Trash size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordOpen}
        onClose={closePasswordModal}
      />
      <DeleteAccountModal isOpen={isDeleteOpen} onClose={closeDeleteModal} />
    </>
  );
}
