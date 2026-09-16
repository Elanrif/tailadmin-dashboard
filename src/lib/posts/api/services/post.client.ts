import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Post, PostFilters, PostsResponse } from "@/lib/posts/api/types";
import { PostCreateFormValues, PostUpdateFormValues } from "../../schemas/post";
import { unwrapApiError } from "@/lib/shared/handle-api-error";

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
): Promise<PostsResponse> {
  try {
    const { data } = await frontendHttp().get<PostsResponse>(postsUrl, {
      params: filters,
    });
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function fetchPostById(id: number): Promise<Post> {
  try {
    const { data } = await frontendHttp().get<Post>(`${postsUrl}/${id}`);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

// --- Mutations ---

export async function createPost(payload: PostCreateFormValues): Promise<Post> {
  try {
    const { data } = await frontendHttp().post<Post>(postsUrl, payload);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function updatePost(
  id: number,
  payload: PostUpdateFormValues,
): Promise<Post> {
  try {
    const { data } = await frontendHttp().patch<Post>(
      `${postsUrl}/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function deletePost(id: number): Promise<void> {
  try {
    await frontendHttp().delete(`${postsUrl}/${id}`);
  } catch (error) {
    throw unwrapApiError(error);
  }
}
