"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { postsQueryOptions } from "@/lib/posts/api/queries/queries.client";
import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon, PlusIcon } from "@/icons";
import { LoaderIcon } from "lucide-react";
import { User } from "@/lib/users/api/types";
import {
  createCommentMutation,
  updateCommentMutation,
} from "../../api/mutations";
import { commentKeys } from "../../api/queries";
import {
  commentCreateSchema,
  CommentFormValues,
  CommentUpdateFormValues,
  commentUpdateSchema,
} from "../../schemas/comment";
import { Comment, CommentCreate, CommentUpdate } from "../../api/types";
import { CommentsQueryProps } from "../comments";

interface CommentFormProps {
  initialData: Comment | null;
  pageTitle: string;
  postId?: number;
  authorId?: number;
  hiddenFields?: CommentsQueryProps["queryParams"];
  onSaved?: () => void;
}

export function CommentForm({
  initialData,
  pageTitle,
  onSaved,
  hiddenFields: { postId, authorId } = {},
}: CommentFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isEdit = !!initialData;

  const selectedPostId = initialData?.postId ?? postId;
  const selectedAuthorId = initialData?.author?.id ?? authorId;
  const showPostSelect = selectedPostId == null;
  const showAuthorSelect = selectedAuthorId == null;

  const formSchema = isEdit ? commentUpdateSchema : commentCreateSchema;
  const { data: postsResult } = useSuspenseQuery(
    postsQueryOptions({ size: 1000 }),
  );

  const { data: usersResult } = useSuspenseQuery(
    usersQueryOptions({ size: 1000 }),
  );

  const posts = postsResult.ok ? postsResult.data.data : [];
  const users = usersResult.ok ? usersResult.data.data : [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues | CommentUpdateFormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      content: initialData?.content ?? "",
      postId: selectedPostId,
      authorId: selectedAuthorId,
    },
  });

  // Création
  const createMutation = useMutation({
    ...createCommentMutation,

    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to create comment");
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });

      toast.success("Comment created successfully");
      onSaved?.();

      //router.push("/dashboard/comments");
      router.refresh();
    },

    onError: () => {
      toast.error("Failed to create comment");
    },
  });

  // Modification
  const updateMutation = useMutation({
    ...updateCommentMutation,

    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to update comment");
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: commentKeys.all,
      });

      toast.success("Comment updated successfully");

      onSaved?.();

      //router.push("/dashboard/comments");
      router.refresh();
    },

    onError: () => {
      toast.error("Failed to update comment");
    },
  });

  const onSubmit = (values: CommentFormValues | CommentUpdateFormValues) => {
    if (isEdit) {
      const parsed = commentUpdateSchema.safeParse(values);

      if (parsed.success) {
        const payload: CommentUpdate = parsed.data;

        updateMutation.mutate({
          id: initialData.id,
          values: payload,
        });
      }

      return;
    }

    const parsed = commentCreateSchema.safeParse(values);

    if (parsed.success) {
      const payload: CommentCreate = parsed.data;

      createMutation.mutate(payload);
    }
  };

  const isSaving =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {Object.keys(errors).length > 0 && (
        <ComponentCard>
          <p className="text-sm text-error-500">
            Certains champs contiennent des erreurs. Veuillez les corriger.
          </p>
        </ComponentCard>
      )}

      <ComponentCard title={pageTitle}>
        <div className="space-y-5">
          {/* CONTENT */}
          <div>
            <Label required>Content</Label>

            <textarea
              {...register("content")}
              rows={6}
              className="w-full rounded-lg border px-3 py-2 dark:bg-gray-900"
              placeholder="Write your comment..."
            />

            {errors.content && (
              <p className="text-sm text-error-500">{errors.content.message}</p>
            )}
          </div>

          {/* POST */}
          {showPostSelect ? (
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

              {errors.postId && (
                <p className="text-sm text-error-500">
                  {errors.postId.message}
                </p>
              )}
            </div>
          ) : (
            <input type="hidden" {...register("postId")} />
          )}

          {/* AUTHOR */}
          {showAuthorSelect ? (
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

              {errors.authorId && (
                <p className="text-sm text-error-500">
                  {errors.authorId.message}
                </p>
              )}
            </div>
          ) : (
            <input type="hidden" {...register("authorId")} />
          )}
        </div>
      </ComponentCard>

      <Button
        type="submit"
        size="sm"
        variant="primary"
        startIcon={<PlusIcon size={16} />}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : isEdit ? "Edit comment" : "Create comment"}

        {isSaving && <LoaderIcon className="ml-2 animate-spin" />}
      </Button>
    </form>
  );
}
