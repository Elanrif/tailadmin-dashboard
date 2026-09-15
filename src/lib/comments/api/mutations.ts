import { mutationOptions } from "@tanstack/react-query";
import { commentKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";
import { CommentFormValues, CommentUpdateFormValues } from "../schemas/comment";
import { postKeys } from "@/lib/posts/api/queries";
import type { ApiError } from "@/lib/shared/api-error";
import type { Comment } from "./types";
import {
  createComment,
  updateComment,
  deleteComment,
} from "./services/comment.client";

export const createCommentMutation = mutationOptions<
  Comment,
  ApiError,
  CommentFormValues,
  unknown
>({
  mutationFn: async (payload) => {
    const result = await createComment(payload);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const updateCommentMutation = mutationOptions<
  Comment,
  ApiError,
  { id: number; values: CommentUpdateFormValues },
  unknown
>({
  mutationFn: async ({ id, values }) => {
    const result = await updateComment(id, values);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const deleteCommentMutation = mutationOptions<
  void,
  ApiError,
  number,
  unknown
>({
  mutationFn: async (id) => {
    const result = await deleteComment(id);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});
