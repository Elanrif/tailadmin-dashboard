import { queryOptions } from "@tanstack/react-query";
import type { CommentFilters } from "../types";
import { fetchCommentById, fetchComments } from "../services/comment.client";
import { commentKeys } from ".";
import type { Comment, CommentsResponse } from "../types";
import type { ApiError } from "@/lib/shared/api-error";

export const commentsQueryOptions = (filters: CommentFilters) =>
  queryOptions<CommentsResponse, ApiError>({
    queryKey: commentKeys.list(filters),
    queryFn: () => fetchComments(filters),
  });

export const commentByIdQueryOptions = (id: number) =>
  queryOptions<Comment, ApiError>({
    queryKey: commentKeys.detail(id),
    queryFn: () => fetchCommentById(id),
  });
