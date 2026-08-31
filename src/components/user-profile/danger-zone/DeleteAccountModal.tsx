"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteFormSchema, DeleteFormValues } from "@/lib/auth/schemas/auth";
import { addressKeys } from "@/lib/addresses/api/queries";
import { getQueryClient } from "@/lib/query-client";
import { deleteMyAccountMutation } from "@/lib/auth/api/mutation";
import { useSession } from "@/lib/auth/components/auth.context";
import { Modal } from "@/components/ui/modal";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
}: DeleteAccountModalProps) {
  const MESSAGE_DELETE_ACCOUNT = '"I want to delete my account"';
  const { user, signOut } = useSession();
  const queryClient = getQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      emailInput: user?.email || "",
      messageInput: "",
    },
  });

  const deleteAccountMutation = useMutation({
    ...deleteMyAccountMutation,
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to delete account");
        return;
      }
      toast.success("Account deleted successfully");
      await queryClient.invalidateQueries({ queryKey: addressKeys.all });
      signOut();
      onClose();
      reset();
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  const onSubmitDelete = (values: DeleteFormValues) => {
    deleteAccountMutation.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <form
        onSubmit={handleSubmit(onSubmitDelete)}
        className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11"
      >
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Delete Account
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Once you delete your account, you will lose all your data. This
            action cannot be undone.
          </p>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            To confirm deletion, please enter the following message:
            <strong className="ml-1 text-red-600">
              {MESSAGE_DELETE_ACCOUNT}
            </strong>
          </p>

          {/*           {Object.keys(errors).length > 0 && (
            <ComponentCard>
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="font-semibold text-red-700">
                    Impossible de soumettre le formulaire
                  </h4>
                  <p className="mt-1 text-sm text-red-600">
                    Certains champs contiennent des erreurs.
                  </p>
                </div>
              </div>
            </ComponentCard>
          )} */}

          <Input
            type="text"
            {...register("messageInput")}
            placeholder="Enter the message to confirm deletion"
          />
          {errors.messageInput && (
            <p className="mt-1 text-sm text-error-500">
              {errors.messageInput.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose} type="button">
            Close
          </Button>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
