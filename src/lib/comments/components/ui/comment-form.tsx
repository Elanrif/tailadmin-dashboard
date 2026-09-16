"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoaderIcon, PenIcon } from "lucide-react";

import { postsQueryOptions } from "@/lib/posts/api/queries/queries.client";
import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon } from "@/icons";
import { User } from "@/lib/users/api/types";
import {
  createCommentMutation,
  updateCommentMutation,
} from "../../api/mutations";
import {
  commentCreateSchema,
  CommentFormValues,
  CommentUpdateFormValues,
  commentUpdateSchema,
} from "../../schemas/comment";
import { Comment } from "../../api/types";
import { CommentsQueryProps } from "../comments";
import environment from "@/config/environment.config";

interface CommentFormProps {
  initialData: Comment | null;
  pageTitle: string;
  hiddenFields?: CommentsQueryProps["queryParams"];
  onSaved?: () => void;
}

export function CommentForm({
  initialData,
  pageTitle,
  onSaved,
  hiddenFields: { postId, authorId } = {},
}: CommentFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEdit = !!initialData;
  const selectedPostId = initialData?.postId ?? postId;
  const selectedAuthorId = initialData?.author?.id ?? authorId;
  const showPostSelect = !isEdit && selectedPostId == null;
  const showAuthorSelect = !isEdit && selectedAuthorId == null;
  const formSchema = isEdit ? commentUpdateSchema : commentCreateSchema;
  const { data: postsResult } = useQuery({
    ...postsQueryOptions({ size: environment.pagination.size }),
    enabled: showPostSelect,
  });
  const { data: usersResult } = useQuery({
    ...usersQueryOptions({ size: environment.pagination.size }),
    enabled: showAuthorSelect,
  });
  const posts = postsResult?.content ?? [];
  const users = usersResult?.content ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues | CommentUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          content: initialData?.content ?? "",
        }
      : {
          content: "",
          postId: selectedPostId,
          authorId: selectedAuthorId,
        },
  });

  const createMutation = useMutation(createCommentMutation);
  const updateMutation = useMutation(updateCommentMutation);

  const onSubmit = (values: CommentFormValues | CommentUpdateFormValues) => {
    setSubmitError(null);

    if (isEdit) {
      updateMutation.mutate(
        {
          id: initialData.id,
          values: values as CommentUpdateFormValues,
        },
        {
          onSuccess: async () => {
            toast.success("Comment updated successfully");
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

    createMutation.mutate(values as CommentFormValues, {
      onSuccess: async () => {
        toast.success("Comment created successfully");
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
      className="w-full space-y-4 px-1 sm:space-y-5 sm:px-0"
    >
      {Object.keys(errors).length > 0 && (
        <ComponentCard>
          <p className="text-xs text-error-500 sm:text-sm">
            Some fields contain errors. Please fix them.
          </p>
        </ComponentCard>
      )}

      {submitError && (
        <ComponentCard>
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-700">
                Failed to save comment
              </h4>
              <p className="mt-1 text-sm text-red-600">{submitError}</p>
            </div>
          </div>
        </ComponentCard>
      )}

      <ComponentCard title={pageTitle}>
        <div className="space-y-4 sm:space-y-5">
          {/* CONTENT */}
          <div>
            <Label required>Content</Label>

            <textarea
              {...register("content")}
              rows={5}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 sm:text-base"
              placeholder="Write your comment..."
            />

            {errors.content && (
              <p className="text-xs text-error-500 sm:text-sm">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* POST : uniquement à la création */}
          {!isEdit &&
            (showPostSelect ? (
              <div>
                <Label required>Post</Label>

                <div className="relative">
                  <Select
                    options={posts.map((post) => ({
                      value: String(post.id),
                      label: post.title,
                    }))}
                    placeholder="Select a post"
                    defaultValue=""
                    onChange={(value) =>
                      setValue("postId", Number(value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <ChevronDownIcon />
                  </span>
                </div>

                {"postId" in errors && errors.postId && (
                  <p className="text-xs text-error-500 sm:text-sm">
                    {errors.postId.message as string}
                  </p>
                )}
              </div>
            ) : (
              <input type="hidden" {...register("postId")} />
            ))}

          {/* AUTHOR : uniquement à la création */}
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
                    defaultValue=""
                    onChange={(value) =>
                      setValue("authorId", Number(value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
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
      </ComponentCard>

      <Button
        type="submit"
        size="sm"
        variant="primary"
        startIcon={isEdit && <PenIcon size={16} />}
        disabled={isSaving}
        className="w-full sm:w-auto"
      >
        {isSaving ? "Saving..." : isEdit ? "Edit comment" : "Add comment"}
        {isSaving && <LoaderIcon className="ml-2 animate-spin" />}
      </Button>
    </form>
  );
}
