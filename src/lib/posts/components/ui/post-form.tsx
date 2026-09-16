"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";
import { useImageDraft } from "@/lib/shared/cloudinary/hooks/use-image-draft";
import { ImageUpload } from "@/lib/shared/cloudinary/components/image-upload";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { LoaderIcon, PenIcon } from "lucide-react";
import { ChevronDownIcon } from "@/icons";
import { User } from "@/lib/users/api/types";
import Alert from "@/components/ui/alert/Alert";
import {
  postCreateSchema,
  PostCreateFormValues,
  PostUpdateFormValues,
  postUpdateSchema,
} from "../../schemas/post";
import { createPostMutation, updatePostMutation } from "../../api/mutations";
import { Post } from "../../api/types";
import { PostQueryProps } from "../posts";
import environment from "@/config/environment.config";

interface PostFormProps {
  initialData: Post | null;
  pageTitle: string;
  onSaved?: () => void;
  hiddenFields?: PostQueryProps["queryParams"];
}

export function PostForm({
  initialData,
  pageTitle,
  hiddenFields: { authorId } = {},
  onSaved,
}: PostFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEdit = !!initialData;
  const selectedAuthorId = initialData?.author?.id ?? authorId;
  const showAuthorSelect = !isEdit && selectedAuthorId == null;

  const { data: usersResult } = useQuery({
    ...usersQueryOptions({ size: environment.pagination.size }),
    enabled: showAuthorSelect,
  });

  const users = usersResult?.content ?? [];
  const formSchema = isEdit ? postUpdateSchema : postCreateSchema;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostCreateFormValues | PostUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: initialData.title,
          description: initialData.description,
          imageUrl: initialData.imageUrl,
        }
      : {
          title: "",
          description: "",
          imageUrl: "",
          authorId,
        },
  });

  const image = useImageDraft({
    storageKey: `post:image:${initialData?.id ?? "new"}`,
    initialUrl: initialData?.imageUrl,
  });

  const createMutation = useMutation(createPostMutation);
  const updateMutation = useMutation(updatePostMutation);

  const onSubmit = (values: PostCreateFormValues | PostUpdateFormValues) => {
    setSubmitError(null);

    if (isEdit) {
      updateMutation.mutate(
        {
          id: initialData.id,
          values: values as PostUpdateFormValues,
        },
        {
          onSuccess: () => {
            image.clearDraft();
            toast.success("Post updated successfully");
            onSaved?.();
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

    createMutation.mutate(values as PostCreateFormValues, {
      onSuccess: () => {
        image.clearDraft();
        toast.success("Post created successfully");
        onSaved?.();
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
        <div className="space-y-4 sm:space-y-5">
          {Object.keys(errors).length > 0 && (
            <ComponentCard>
              <Alert
                variant="error"
                title="Error Message"
                message="Please check the form for errors and try again."
                showLink={false}
              />
            </ComponentCard>
          )}

          {submitError && (
            <ComponentCard>
              <Alert
                variant="error"
                title="Failed to save post"
                message={submitError}
                showLink={false}
              />
            </ComponentCard>
          )}

          <ComponentCard>
            <div className="space-y-5">
              <div>
                <Label required>Title</Label>

                <Input {...register("title")} placeholder="Post title" />

                {errors.title && (
                  <p className="text-xs text-error-500 sm:text-sm">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label required>Description</Label>

                <textarea
                  {...register("description")}
                  rows={5}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 sm:text-base"
                  placeholder="Write your post..."
                />

                {errors.description && (
                  <p className="text-xs text-error-500 sm:text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Author : uniquement à la création, jamais à l'édition */}
              {!isEdit &&
                (showAuthorSelect ? (
                  <div>
                    <Label required>Author</Label>

                    <div className="relative">
                      <Select
                        options={users.map((user: User) => ({
                          value: String(user.id),
                          label: `${user.firstName} ${user.lastName} (${user.email})`,
                        }))}
                        placeholder="Select an author"
                        defaultValue={String(authorId ?? "")}
                        onChange={(value) =>
                          setValue("authorId", Number(value), {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>

                    {"authorId" in errors && errors.authorId && (
                      <p className="text-xs text-error-500 sm:text-sm">
                        {errors.authorId.message as string}
                      </p>
                    )}
                  </div>
                ) : (
                  <input type="hidden" {...register("authorId")} />
                ))}
            </div>

            <ImageUpload
              folder="posts"
              value={image.url}
              publicId={image.publicId}
              onChange={(url, publicId) => {
                image.handleChange(url, publicId);

                setValue("imageUrl", url, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              onRemove={() => {
                image.handleRemove();

                setValue("imageUrl", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
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
              {isSaving ? "Saving..." : isEdit ? "Edit post" : "Add post"}

              {isSaving && <LoaderIcon className="ml-2 animate-spin" />}
            </Button>
          </ComponentCard>
        </div>
      </div>
    </form>
  );
}
