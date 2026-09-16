"use client";
import React from "react";
import { useSession } from "@/lib/auth/components/auth.context";
import {
  CurrentUserFormValues,
  CurrentUserSchema,
} from "@/lib/account/schemas/account";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updateMyProfileMutation } from "@/lib/account/api/mutation";
import { toast } from "sonner";
import { UserStatus } from "@/lib/users/api/types";
import { useModal } from "@/hooks/useModal";
import Switch from "@/components/form/switch/Switch";
import { Modal } from "@/components/ui/modal";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Button from "@/components/ui/button/Button";

const countries = [
  { code: "KM", label: "+269" },
  { code: "MA", label: "+212" },
  { code: "US", label: "+1" },
  { code: "GB", label: "+44" },
  { code: "CA", label: "+1" },
  { code: "AU", label: "+61" },
];
export default function UserInfoCard() {
  const { user, setUser } = useSession();
  const { isOpen, openModal, closeModal } = useModal();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CurrentUserFormValues>({
    resolver: zodResolver(CurrentUserSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      avatarUrl: user?.avatarUrl ?? "",
    },
  });

  const updateMutation = useMutation(updateMyProfileMutation);

  const onSubmit = (values: CurrentUserFormValues) => {
    updateMutation.mutate(values, {
      onSuccess: (data) => {
        setUser(data);
        toast.success("Profile updated successfully");
        closeModal();
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

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue("phoneNumber", phoneNumber, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="min-w-0">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                First Name
              </p>
              <p className="break-all text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.firstName ?? "N/A"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="break-all text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.lastName ?? "N/A"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="break-all text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email ?? "N/A"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="break-all text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.phoneNumber ?? "N/A"}
              </p>
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Compte activé?
              </p>
              <Switch
                label={user?.status === UserStatus.ACTIVE ? "Oui" : "Non"}
                defaultChecked={user?.status === UserStatus.ACTIVE}
                disabled
              />
            </div>

            <div className="min-w-0">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="break-all text-sm font-medium text-gray-800 dark:text-white/90">
                Team Manager
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-175 m-4">
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {Object.keys(errors).length > 0 && (
              <ComponentCard>
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-700">
                      Impossible de soumettre le formulaire
                    </h4>
                    <p className="mt-1 text-sm text-red-600">
                      Certains champs contiennent des erreurs. Veuillez les
                      corriger avant de réessayer.
                    </p>
                  </div>
                </div>
              </ComponentCard>
            )}
            <div className="custom-scrollbar h-112.5 overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      defaultValue="https://www.facebook.com/PimjoHQ"
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input type="text" defaultValue="https://x.com/PimjoHQ" />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      defaultValue="https://www.linkedin.com/company/pimjo"
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input
                      type="text"
                      defaultValue="https://instagram.com/PimjoHQ"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label required>First Name</Label>
                    <Input {...register("firstName")} type="text" />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label required>Last Name</Label>
                    <Input {...register("lastName")} type="text" />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label required>Email Address</Label>
                    <Input {...register("email")} type="text" />
                  </div>
                  <div>
                    <Label required>Phone</Label>
                    <PhoneInput
                      {...register("phoneNumber")}
                      selectPosition="start"
                      countries={countries}
                      placeholder="+1 (555) 000-0000"
                      onChange={handlePhoneNumberChange}
                      value={user?.phoneNumber}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-error-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>{" "}
                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input type="text" defaultValue="Team Manager" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button type="submit" size="sm">
                {isSubmitting || updateMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
