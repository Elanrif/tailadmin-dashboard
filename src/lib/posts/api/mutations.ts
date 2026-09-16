import { mutationOptions } from "@tanstack/react-query";
import { postKeys } from "./queries";
import { getQueryClient } from "@/lib/query-client";
import { PostCreateFormValues, PostUpdateFormValues } from "../schemas/post";
import { ApiError } from "@/lib/shared/api-error";
import { Post, TogglePostLikeResponse } from "./types";
import { commentKeys } from "@/lib/comments/api/queries";
import {
  createPost,
  updatePost,
  deletePost,
  togglePostLike,
} from "./services/post.client";

export const createPostMutation = mutationOptions<
  Post,
  ApiError,
  PostCreateFormValues,
  unknown
>({
  mutationFn: (payload) => createPost(payload),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const updatePostMutation = mutationOptions<
  Post,
  ApiError,
  { id: number; values: PostUpdateFormValues },
  unknown
>({
  mutationFn: ({ id, values }) => updatePost(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const deletePostMutation = mutationOptions<
  void,
  ApiError,
  number,
  unknown
>({
  mutationFn: (id) => deletePost(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
    getQueryClient().invalidateQueries({ queryKey: commentKeys.all });
  },
});

export const togglePostLikeMutation = mutationOptions<
  TogglePostLikeResponse,
  ApiError,
  number,
  unknown
>({
  mutationFn: (id) => togglePostLike(id),
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});
