"use server";

import { queryOptions } from "@tanstack/react-query";
import type { CommentFilters } from "../types";
import { commentKeys } from ".";
import { getCommentById, getComments } from "../services/comment.server";
import type { Comment, CommentsResponse } from "../types";
import type { ApiError } from "@/lib/shared/api-error";

export const commentsQueryOptions = (filters: CommentFilters) =>
  queryOptions<CommentsResponse, ApiError>({
    queryKey: commentKeys.list(filters),
    queryFn: async () => {
      const response = await getComments(filters);
      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });

export const commentByIdQueryOptions = (id: number) =>
  queryOptions<Comment, ApiError>({
    queryKey: commentKeys.detail(id),
    queryFn: async () => {
      const response = await getCommentById(id);
      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });
