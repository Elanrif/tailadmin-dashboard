"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  UserCreateFormValues,
  UserCreatePayload,
  userCreateSchema,
  UserUpdateFormValues,
  UserUpdatePayload,
  userUpdateSchema,
} from "../../schemas/user";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import {
  ChevronDownIcon,
  EnvelopeIcon,
  EyeCloseIcon,
  EyeIcon,
  PlusIcon,
} from "@/icons";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Switch from "@/components/form/switch/Switch";
import { useImageDraft } from "@/lib/shared/cloudinary/hooks/use-image-draft";
import { ImageUpload } from "@/lib/shared/cloudinary/components/image-upload";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import Alert from "@/components/ui/alert/Alert";
import { createUserMutation, updateUserMutation } from "../../api/mutations";
import { userKeys } from "@/lib/auth/api/queries";
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
  const queryClient = useQueryClient();
  const isEdit = !!initialData;
  const formSchema = isEdit ? userUpdateSchema : userCreateSchema;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
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
          avatarUrl: initialData?.avatarUrl ?? "",
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

  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to create user");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User created successfully");
      onSaved?.();
      router.push("/dashboard/users");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });

  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to update user");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User updated successfully");
      onSaved?.();
      router.push("/dashboard/users");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const onSubmit = (values: UserCreateFormValues | UserUpdateFormValues) => {
    if (isEdit) {
      // On applique la validation/transformation d'update
      const parsed = userUpdateSchema.safeParse(values);
      if (parsed.success) {
        updateMutation.mutate({
          id: initialData.id,
          // On force le cast vers UserUpdate pour que l'union se resolve proprement
          values: parsed.data as UserUpdatePayload,
        });
      }
    } else {
      // On force le cast vers UserCreate car on sait qu'on est en mode création
      createMutation.mutate(values as UserCreatePayload);
      reset();
    }
    handleImageRemove();
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

  const image = useImageDraft({
    storageKey: "post:image",
    initialUrl: undefined,
  });

  function handleImageChange(url: string, publicId: string) {
    image.handleChange(url, publicId);
    setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
  }

  function handleImageRemove() {
    image.handleRemove();
    setValue("avatarUrl", "", { shouldDirty: true, shouldValidate: true });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex h-[90vh] max-h-[90vh] flex-col"
    >
      {/* =====================================================
          HEADER FIXE
          ===================================================== */}
      <div className="sticky top-0 z-20 shrink-0 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {pageTitle}
        </h2>
      </div>

      {/* =====================================================
          CONTENU SCROLLABLE
          ===================================================== */}
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        {Object.keys(errors).length > 0 && (
          <Alert
            variant="error"
            title="Error Message"
            message="Please check the form for errors and try again."
            showLink={false}
          />
        )}

        <ComponentCard title={isEdit ? "Edit User Details" : "Create New User"}>
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-6 gap-4">
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
                  className="pl-[62px]"
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
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
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
          <div className="grid grid-cols-1 md:grid-cols-2 space-y-6 gap-4">
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
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
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
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
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
            <div className="mb-6 flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
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
            onChange={handleImageChange}
            onRemove={handleImageRemove}
            variant="light"
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            startIcon={<PlusIcon size={16} />}
            disabled={
              isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending
            }
          >
            {isEdit ? "Edit user" : "Create user"}
            {isSubmitting && <LoaderIcon className="animate-spin ml-2" />}
          </Button>
        </ComponentCard>
      </div>
    </form>
  );
}
