import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Post, PostFilters, PostsResponse } from "@/lib/posts/api/types";
import { PostCreateFormValues, PostUpdateFormValues } from "../../schemas/post";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { posts: postsUrl },
    },
  },
} = proxyEnvironment;

// --- Queries ---

export async function fetchPosts(
  filters?: PostFilters,
): Promise<Result<PostsResponse, ApiError>> {
  const { data } = await frontendHttp().get<Result<PostsResponse, ApiError>>(
    postsUrl,
    { params: filters },
  );

  return data;
}

export async function fetchPostById(
  id: number,
): Promise<Result<Post, ApiError>> {
  const { data } = await frontendHttp().get<Result<Post, ApiError>>(
    `${postsUrl}/${id}`,
  );

  return data;
}

// --- Mutations ---

export async function createPost(
  payload: PostCreateFormValues,
): Promise<Result<Post, ApiError>> {
  const { data } = await frontendHttp().post<Result<Post, ApiError>>(
    postsUrl,
    payload,
  );

  return data;
}

export async function updatePost(
  id: number,
  payload: PostUpdateFormValues,
): Promise<Result<Post, ApiError>> {
  const { data } = await frontendHttp().patch<Result<Post, ApiError>>(
    `${postsUrl}/${id}`,
    payload,
  );

  return data;
}

export async function deletePost(id: number): Promise<Result<void, ApiError>> {
  const { data } = await frontendHttp().delete<Result<void, ApiError>>(
    `${postsUrl}/${id}`,
  );

  return data;
}
