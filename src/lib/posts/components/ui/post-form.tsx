"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";
import { useImageDraft } from "@/lib/shared/cloudinary/hooks/use-image-draft";
import { ImageUpload } from "@/lib/shared/cloudinary/components/image-upload";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { LoaderIcon, PlusIcon } from "lucide-react";
import { ChevronDownIcon } from "@/icons";
import { User } from "@/lib/users/api/types";
import Alert from "@/components/ui/alert/Alert";
import {
  PostCreatePayload,
  postCreateSchema,
  PostFormValues,
  PostUpdateFormValues,
  PostUpdatePayload,
  postUpdateSchema,
} from "../../schemas/post";
import { createPostMutation, updatePostMutation } from "../../api/mutations";
import { postKeys } from "../../api/queries";
import { Post } from "../../api/types";
import { PostQueryProps } from "../posts";

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
  const queryClient = useQueryClient();

  const isEdit = !!initialData;

  const selectedAuthorId = initialData?.author?.id ?? authorId;
  const showAuthorSelect = selectedAuthorId == null;

  const formSchema = isEdit ? postUpdateSchema : postCreateSchema;

  const { data: usersResult } = useSuspenseQuery(
    usersQueryOptions({ size: 1000 }),
  );
  const users = usersResult.ok ? usersResult.data.data : [];

  const image = useImageDraft({
    storageKey: `post:image:${initialData?.id ?? "new"}`,
    initialUrl: initialData?.imageUrl,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues | PostUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: initialData?.title ?? "",
          description: initialData?.description ?? "",
          imageUrl: initialData?.imageUrl ?? "",
          likes: initialData?.likes ?? 0,
          authorId: authorId ?? initialData?.author?.id,
        }
      : {
          title: "",
          description: "",
          imageUrl: "",
          likes: 0,
          authorId,
        },
  });

  // =========================================================
  // CREATE
  // =========================================================

  const createMutation = useMutation({
    ...createPostMutation,

    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to create post");
        return;
      }

      image.clearDraft();

      await queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });

      toast.success("Post created successfully");

      onSaved?.();
    },

    onError: () => {
      toast.error("Failed to create post");
    },
  });

  // =========================================================
  // UPDATE
  // =========================================================

  const updateMutation = useMutation({
    ...updatePostMutation,

    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to update post");
        return;
      }

      image.clearDraft();

      await queryClient.invalidateQueries({
        queryKey: postKeys.all,
      });

      toast.success("Post updated successfully");

      onSaved?.();
    },

    onError: () => {
      toast.error("Failed to update post");
    },
  });

  // =========================================================
  // SUBMIT
  // =========================================================

  const onSubmit = (values: PostFormValues | PostUpdateFormValues) => {
    if (isEdit) {
      const parsed = postUpdateSchema.safeParse(values);

      if (parsed.success) {
        const payload: PostUpdatePayload = parsed.data;

        updateMutation.mutate({
          id: initialData.id,
          values: payload,
        });
      }
    } else {
      const parsed = postCreateSchema.safeParse(values);

      if (parsed.success) {
        const payload: PostCreatePayload = parsed.data;

        createMutation.mutate(payload);
      }
    }
  };

  const isSaving =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  // =========================================================
  // UI
  // =========================================================

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
        <div className="space-y-5">
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

          {/* =================================================
              POST INFORMATION
              ================================================= */}
          <ComponentCard>
            <div className="space-y-5">
              {/* Title */}
              <div>
                <Label required>Title</Label>

                <Input {...register("title")} placeholder="Post title" />

                {errors.title && (
                  <p className="text-sm text-error-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>

                <textarea
                  {...register("description")}
                  rows={6}
                  className="w-full rounded-lg border px-3 py-2 dark:bg-gray-900"
                  placeholder="Write your post..."
                />

                {errors.description && (
                  <p className="text-sm text-error-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Author */}
              {showAuthorSelect ? (
                <div>
                  <Label>Author</Label>

                  <div className="relative">
                    <Select
                      options={users.map((user: User) => ({
                        value: String(user.id),
                        label: `${user.firstName} ${user.lastName} (${user.email})`,
                      }))}
                      placeholder="Select an author"
                      defaultValue={String(
                        authorId ?? initialData?.author?.id ?? "",
                      )}
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

                  <input
                    type="hidden"
                    {...register("authorId", {
                      setValueAs: (value) =>
                        value === "" ? undefined : Number(value),
                    })}
                  />

                  {errors.authorId && (
                    <p className="text-sm text-error-500">
                      {errors.authorId.message}
                    </p>
                  )}
                </div>
              ) : (
                <input type="hidden" {...register("authorId")} />
              )}

              {/* Likes */}
              <div>
                <Label>Likes</Label>

                <Input
                  type="number"
                  min={0}
                  {...register("likes", {
                    valueAsNumber: true,
                  })}
                />

                {errors.likes && (
                  <p className="text-sm text-error-500">
                    {errors.likes.message}
                  </p>
                )}
              </div>
            </div>
          </ComponentCard>

          {/* =================================================
              IMAGE
              ================================================= */}
          <ComponentCard title="Post image">
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

            {/* =================================================
                SUBMIT
                ================================================= */}
            <div className="mt-5 flex justify-end">
              <Button
                type="submit"
                size="sm"
                variant="primary"
                startIcon={<PlusIcon size={16} />}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : isEdit ? "Edit post" : "Create post"}

                {isSaving && <LoaderIcon className="ml-2 animate-spin" />}
              </Button>
            </div>
          </ComponentCard>
        </div>
      </div>
    </form>
  );
}
