"use client";
import { ImageUpload } from "@/lib/shared/cloudinary/components/image-upload";
import Image from "next/image";
import { useSession } from "@/lib/auth/components/auth.context";
import { useImageDraft } from "@/lib/shared/cloudinary/hooks/use-image-draft";
import {
  CurrentUserFormValues,
  CurrentUserSchema,
} from "@/lib/account/schemas/account";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateMyProfileMutation } from "@/lib/account/api/mutation";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";

export default function UserImageCard() {
  const { user, setUser } = useSession();
  const {
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = useForm<CurrentUserFormValues>({
    resolver: zodResolver(CurrentUserSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
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

  const updateMutation = useMutation(updateMyProfileMutation);
  const onSubmit = (values: CurrentUserFormValues) => {
    updateMutation.mutate(values, {
      onSuccess: (data) => {
        setUser(data);
        toast.success("Profile picture updated successfully");
      },
      onError: (error) => {
        if (error.status === 401) {
          toast.error("Votre session a expiré, veuillez vous reconnecter.");
          return;
        }
        toast.error(error.message);
      },
    });
    handleImageRemove();
  };

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
          {isSubmitting || updateMutation.isPending ? (
            <LoaderIcon className="animate-spin" />
          ) : null}
        </Button>
      </ComponentCard>
    </form>
  );
}
