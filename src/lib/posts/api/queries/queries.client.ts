import { queryOptions } from "@tanstack/react-query";
import type { PostFilters } from "../types";
import { fetchPostById, fetchPosts } from "../services/post.client";
import { postKeys } from ".";
import type { Post, PostsResponse } from "../types";
import type { ApiError } from "@/lib/shared/api-error";

export const postsQueryOptions = (filters: PostFilters) =>
  queryOptions<PostsResponse, ApiError>({
    queryKey: postKeys.list(filters),
    queryFn: () => fetchPosts(filters),
  });

export const postByIdQueryOptions = (id: number) =>
  queryOptions<Post, ApiError>({
    queryKey: postKeys.detail(id),
    queryFn: () => fetchPostById(id),
  });
