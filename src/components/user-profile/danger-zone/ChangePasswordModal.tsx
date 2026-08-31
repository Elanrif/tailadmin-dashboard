"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { EyeCloseIcon, EyeIcon } from "@/icons";

import {
  changePasswordSchema,
  ChangePwdFormValues,
} from "@/lib/auth/schemas/auth";
import { addressKeys } from "@/lib/addresses/api/queries";
import { getQueryClient } from "@/lib/query-client";
import { updateMyPasswordMutation } from "@/lib/auth/api/mutation";
import { useSession } from "@/lib/auth/components/auth.context";
import { Modal } from "@/components/ui/modal";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {
  const { user } = useSession();
  const queryClient = getQueryClient();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePwdFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      email: user?.email || "",
    },
  });

  const updatePwdMutation = useMutation({
    ...updateMyPasswordMutation,
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to change password");
        return;
      }
      toast.success("Password changed successfully");
      await queryClient.invalidateQueries({ queryKey: addressKeys.all });
      onClose();
      reset();
    },
    onError: () => {
      toast.error("Failed to change password");
    },
  });

  const onSubmitPassword = (values: ChangePwdFormValues) => {
    updatePwdMutation.mutate(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Change Password
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your password to keep your account secure.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmitPassword)}>
          {Object.keys(errors).length > 0 && (
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
          )}

          <div className="px-2 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
              <div>
                <Label required>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    {...register("currentPassword")}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showCurrentPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-error-500">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label required>New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      {...register("newPassword")}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showNewPassword ? <EyeIcon /> : <EyeCloseIcon />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-error-500">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label required>Confirm Password</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmNewPassword")}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? <EyeIcon /> : <EyeCloseIcon />}
                    </button>
                  </div>
                  {errors.confirmNewPassword && (
                    <p className="mt-1 text-sm text-error-500">
                      {errors.confirmNewPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose} type="button">
              Close
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
