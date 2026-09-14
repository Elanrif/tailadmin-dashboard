"use client";
import { ImageUpload } from "@/lib/shared/cloudinary/components/image-upload";
import ComponentCard from "../common/ComponentCard";
import Image from "next/image";
import { useSession } from "@/lib/auth/components/auth.context";
import { useImageDraft } from "@/lib/shared/cloudinary/hooks/use-image-draft";
import Button from "../ui/button/Button";
import {
  UserUpdateFormValues,
  userUpdateSchema,
} from "@/lib/users/schemas/user";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateUserMutation } from "@/lib/users/api/mutations";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { handleApiError } from "@/lib/shared/handle-api-error";
import { useRouter } from "next/navigation";

export default function UserImageCard() {
  const router = useRouter();
  const { user, setUser } = useSession();
  const {
    handleSubmit,
    setValue,
    control, // 👈 1. Récupère 'control' ici
    formState: { isSubmitting },
  } = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      avatarUrl: user?.avatarUrl,
    },
  });

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

  const updateMutation = useMutation(updateUserMutation);
  const onSubmit = (values: UserUpdateFormValues) => {
    const updateValues = values as UserUpdateFormValues;
    const payload: UserUpdateFormValues = {
      avatarUrl: updateValues.avatarUrl,
    };
    updateMutation.mutate(
      {
        id: user?.id as number,
        values: payload,
      },
      {
        onSuccess: async (data) => {
          setUser(data);
          toast.success("User updated successfully");
        },
        onError: (error) => {
          handleApiError(error, router);
        },
      },
    );
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
