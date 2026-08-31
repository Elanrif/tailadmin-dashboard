"use client";
import { ImageUpload } from "@/lib/shared/cloudinary/components/image-upload";
import ComponentCard from "../common/ComponentCard";
import Image from "next/image";
import { useSession } from "@/lib/auth/components/auth.context";
import { useImageDraft } from "@/lib/shared/cloudinary/hooks/use-image-draft";
import Button from "../ui/button/Button";
import {
  UserUpdateFormValues,
  UserUpdatePayload,
  userUpdateSchema,
} from "@/lib/users/schemas/user";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserMutation } from "@/lib/users/api/mutations";
import { toast } from "sonner";
import { userKeys } from "@/lib/users/api/queries";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";

export default function UserImageCard() {
  const { user, setUser } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    setValue,
    control, // 👈 1. Récupère 'control' ici
    formState: { errors, isSubmitting },
  } = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      avatarUrl: user?.avatarUrl,
    },
  });

  const [errorFromApi, setErrorFromApi] = useState<string | null>(null);
  const image = useImageDraft({
    storageKey: "post:image",
    initialUrl: undefined,
  });

  const currentAvatarUrl = useWatch({
    control,
    name: "avatarUrl",
  });

  function handleImageChange(url: string, publicId: string) {
    image.handleChange(url, publicId);
    setValue("avatarUrl", url);
  }

  function handleImageRemove() {
    image.handleRemove();
    setValue("avatarUrl", "");
  }

  // Mutation modification
  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: async (result) => {
      if (!result.ok) {
        setErrorFromApi(result.error.message || "Une erreur est survenue.");
        toast.error(result.error?.message || "Failed to update user");
        return;
      }
      setUser(result.data);
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User updated successfully");
    },
    onError: () => {
      setErrorFromApi("Une erreur est survenue.");
      toast.error("Failed to update user");
    },
  });

  const onSubmit = (values: UserUpdateFormValues) => {
    const updateValues = values as UserUpdateFormValues;
    const payload: UserUpdatePayload = {
      avatarUrl: updateValues.avatarUrl,
    };
    updateMutation.mutate({
      id: user?.id as number,
      values: payload,
    });
    handleImageRemove();
  };

  // 👈 Étape 3 : On calcule si le bouton doit être désactivé
  // Si currentAvatarUrl est faux (null, undefined, ou ""), l'expression devient 'true'
  const isButtonDisabled = !currentAvatarUrl;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ComponentCard
        title="Change Profile Picture"
        desc="Update your profile picture."
      >
        {errorFromApi && (
          <p className="p-3 text-sm text-center text-red-500 bg-red-100 rounded">
            {errorFromApi}
          </p>
        )}

        {user?.avatarUrl && (
          <div className="mb-6 flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="relative">
              <Image
                src={user.avatarUrl}
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
          disabled={isButtonDisabled} // 👈 Étape 4 : On applique la variable ici
          className="w-full mx-auto"
        >
          Update Profile Picture
          {isSubmitting ? <LoaderIcon className="animate-spin" /> : ""}
        </Button>
      </ComponentCard>
    </form>
  );
}
