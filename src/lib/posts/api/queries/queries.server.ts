"use server";

import { queryOptions } from "@tanstack/react-query";
import type { PostFilters } from "../types";
import { postKeys } from ".";
import { getPostById, getPosts } from "../services/post.server";
import type { Post, PostsResponse } from "../types";
import type { ApiError } from "@/lib/shared/api-error";

export const postsQueryOptions = (filters: PostFilters) =>
  queryOptions<PostsResponse, ApiError>({
    queryKey: postKeys.list(filters),
    queryFn: async () => {
      const response = await getPosts(filters);
      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });

export const postByIdQueryOptions = (id: number) =>
  queryOptions<Post, ApiError>({
    queryKey: postKeys.detail(id),
    queryFn: async () => {
      const response = await getPostById(id);
      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });
