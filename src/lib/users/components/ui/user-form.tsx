"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  UserCreateFormValues,
  userCreateSchema,
  UserUpdateFormValues,
  userUpdateSchema,
} from "../../schemas/user";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import { ChevronDownIcon, EnvelopeIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Switch from "@/components/form/switch/Switch";
import { useImageDraft } from "@/lib/shared/cloudinary/hooks/use-image-draft";
import { ImageUpload } from "@/lib/shared/cloudinary/components/image-upload";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { LoaderIcon, PenIcon } from "lucide-react";
import Image from "next/image";
import Alert from "@/components/ui/alert/Alert";
import { createUserMutation, updateUserMutation } from "../../api/mutations";
import { User, UserRole, UserStatus } from "../../api/types";

interface UserFormProps {
  initialData: User | null;
  pageTitle: string;
  onSaved?: () => void;
}

const options = [
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
];

const countries = [
  { code: "KM", label: "+269" },
  { code: "MA", label: "+212" },
  { code: "US", label: "+1" },
  { code: "GB", label: "+44" },
  { code: "CA", label: "+1" },
  { code: "AU", label: "+61" },
];

export function UserForm({ initialData, pageTitle, onSaved }: UserFormProps) {
  const router = useRouter();

  const isEdit = !!initialData;
  const formSchema = isEdit ? userUpdateSchema : userCreateSchema;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateFormValues | UserUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phoneNumber: initialData.phoneNumber,
          role: initialData.role,
          status: initialData.status,
          avatarUrl: initialData.avatarUrl ?? "",
          password: "",
          confirmPassword: "",
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          avatarUrl: "",
          password: "",
          confirmPassword: "",
        },
  });

  useEffect(() => {
    if (initialData?.role) {
      setValue("role", initialData.role);
    }
  }, [initialData, setValue]);

  const createMutation = useMutation(createUserMutation);
  const updateMutation = useMutation(updateUserMutation);

  const image = useImageDraft({
    storageKey: `user:image:${initialData?.id ?? "new"}`,
    initialUrl: initialData?.avatarUrl,
  });

  const handleImageRemove = () => {
    image.handleRemove();

    setValue("avatarUrl", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (values: UserCreateFormValues | UserUpdateFormValues) => {
    setSubmitError(null);

    if (isEdit) {
      updateMutation.mutate(
        {
          id: initialData.id,
          values: values as UserUpdateFormValues,
        },
        {
          onSuccess: () => {
            image.clearDraft();
            toast.success("User updated successfully");
            onSaved?.();
            router.push("/dashboard/users");
            router.refresh();
          },

          onError: (error) => {
            if (error.status === 401) {
              toast.error("Votre session a expiré, veuillez vous reconnecter.");
              return;
            }
            setSubmitError(error.message);
            toast.error(error.message);
          },
        },
      );

      return;
    }

    createMutation.mutate(values as UserCreateFormValues, {
      onSuccess: () => {
        image.clearDraft();
        toast.success("User created successfully");
        onSaved?.();

        router.push("/dashboard/users");
        router.refresh();
      },

      onError: (error) => {
        if (error.status === 401) {
          toast.error("Votre session a expiré, veuillez vous reconnecter.");
          return;
        }
        setSubmitError(error.message);
        toast.error(error.message);
      },
    });
  };

  const handleRoleChange = (value: string) => {
    setValue("role", value as UserRole, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue("phoneNumber", phoneNumber, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setValue("status", checked ? UserStatus.ACTIVE : UserStatus.INACTIVE, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const isSaving =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-[90vh] max-h-[90vh] flex-col px-1 sm:px-0"
    >
      {/* Header sticky */}
      <div className="sticky top-0 z-20 shrink-0 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900 sm:px-6 sm:py-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white sm:text-xl">
          {pageTitle}
        </h2>
      </div>

      {/* Content scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:p-6">
        {Object.keys(errors).length > 0 && (
          <>
            <Alert
              variant="error"
              title="Error Message"
              message={
                Object.values(errors)
                  .map((e) => e?.message)
                  .filter(Boolean)
                  .join(" · ") ||
                "Please check the form for errors and try again."
              }
              showLink={false}
            />
            {/* Diagnostic temporaire — à retirer une fois le vrai problème identifié */}
            {/* <pre
                  className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 
                      text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {JSON.stringify(errors, null, 2)}
                </pre> */}
          </>
        )}

        {submitError && (
          <Alert
            variant="error"
            title="Failed to save user"
            message={submitError}
            showLink={false}
          />
        )}

        <ComponentCard title={isEdit ? "Edit User Details" : "Create New User"}>
          <div className="grid grid-cols-1 gap-4 space-y-5 md:grid-cols-2 md:space-y-6">
            <div>
              <Label required>First Name</Label>

              <Input
                type="text"
                {...register("firstName")}
                placeholder="Enter first name"
              />

              {errors.firstName && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Label required>Last Name</Label>

              <Input
                type="text"
                {...register("lastName")}
                placeholder="Enter last name"
              />

              {errors.lastName && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <Label required>Email</Label>

              <div className="relative">
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Enter email"
                  className="pl-15.5"
                />

                <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                  <EnvelopeIcon />
                </span>
              </div>

              {errors.email && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label required>Role</Label>

              <div className="relative">
                <Select
                  options={options}
                  placeholder="Select an option"
                  defaultValue={initialData?.role ?? UserRole.USER}
                  onChange={handleRoleChange}
                  className="dark:bg-dark-900"
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>

              {errors.role && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <Label required>Phone</Label>

              <PhoneInput
                {...register("phoneNumber")}
                selectPosition="start"
                countries={countries}
                placeholder="+1 (555) 000-0000"
                onChange={handlePhoneNumberChange}
                value={initialData?.phoneNumber}
              />

              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="flex flex-col justify-end pb-1">
              <Switch
                label="Activé / Désactivé"
                defaultChecked={
                  initialData ? initialData.status === UserStatus.ACTIVE : true
                }
                onChange={handleSwitchChange}
              />
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title={isEdit ? "Change Password" : "Set Password"}>
          <div className="grid grid-cols-1 gap-4 space-y-5 md:grid-cols-2 md:space-y-6">
            <div>
              <Label required={!isEdit}>Password</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label required={!isEdit}>Confirm Password</Label>

              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </ComponentCard>

        <ComponentCard title="Choose a profile picture">
          {initialData?.avatarUrl && (
            <div className="mb-5 flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900 sm:mb-6 sm:p-5">
              <div className="relative">
                <Image
                  src={initialData.avatarUrl}
                  alt="Current profile picture"
                  width={120}
                  height={120}
                  className="h-30 w-30 rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800"
                />

                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white shadow">
                  Current
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
                This is your current profile picture.
              </p>
            </div>
          )}

          <ImageUpload
            value={image.url}
            publicId={image.publicId}
            onChange={(url, publicId) => {
              image.handleChange(url, publicId);

              setValue("avatarUrl", url, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            onRemove={handleImageRemove}
            variant="light"
          />

          <Button
            type="submit"
            size="sm"
            variant="primary"
            startIcon={isEdit && <PenIcon size={16} />}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : isEdit ? "Edit user" : "Add user"}

            {isSaving && <LoaderIcon className="ml-2 animate-spin" />}
          </Button>
        </ComponentCard>
      </div>
    </form>
  );
}
