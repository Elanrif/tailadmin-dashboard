"server-only";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";

import {
  Post,
  PostFilters,
  PostsResponse,
  TogglePostLikeResponse,
} from "@/lib/posts/api/types";
import {
  postCreateSchema,
  PostCreateFormValues,
  PostUpdateFormValues,
  postUpdateSchema,
} from "@/lib/posts/schemas/post";
import { Result } from "@/lib/shared/types";
import { ApiError, fromZodError } from "@/lib/shared/api-error";
import { checkValidId } from "@/utils";

const {
  api: {
    rest: {
      endpoints: { posts: postsUrl },
    },
  },
} = environment;

const logger = getLogger("server");

const postUrl = (id: number) => `${postsUrl}/${id}`;

export async function getPosts(
  filters: PostFilters = {},
): Promise<Result<PostsResponse, ApiError>> {
  try {
    const res = await apiClient().get<PostsResponse>(postsUrl, {
      params: filters,
    });
    logger.info({ count: res.data?.content?.length || 0 }, "Posts fetched");

    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "getPosts"),
    };
  }
}

export async function getPostById(id: number): Promise<Result<Post, ApiError>> {
  const idCheck = checkValidId(id);
  if (idCheck) return idCheck;

  try {
    const response = await apiClient().get<Post>(postUrl(id));

    logger.info({ id }, "Post fetched");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "getPostById"),
    };
  }
}

export async function createPost(
  post: PostCreateFormValues,
): Promise<Result<Post, ApiError>> {
  const parse = postCreateSchema.safeParse(post);
  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "createPost"),
    };
  }

  try {
    const response = await apiClient(true).post<Post>(postsUrl, parse.data);

    logger.info({ id: response.data.id }, "Post created");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "createPost"),
    };
  }
}

export async function updatePost(
  id: number,
  post: PostUpdateFormValues,
): Promise<Result<Post, ApiError>> {
  const idCheck = checkValidId(id);
  if (idCheck) return idCheck;

  const parse = postUpdateSchema.safeParse(post);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "updatePost"),
    };
  }

  try {
    const response = await apiClient(true).patch<Post>(postUrl(id), parse.data);
    logger.info({ id }, "Post updated");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "updatePost"),
    };
  }
}

export async function deletePost(id: number): Promise<Result<void, ApiError>> {
  const idCheck = checkValidId(id);
  if (idCheck) return idCheck;

  try {
    await apiClient(true).delete(postUrl(id));
    logger.info({ id }, "Post deleted");

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "deletePost"),
    };
  }
}

export async function togglePostLike(
  id: number,
): Promise<Result<TogglePostLikeResponse, ApiError>> {
  const idCheck = checkValidId(id, "post");
  if (idCheck) return idCheck;

  try {
    const response = await apiClient(true).post<TogglePostLikeResponse>(
      `${postUrl(id)}/like`,
    );

    logger.info({ id, liked: response.data.liked }, "Post like toggled");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "togglePostLike"),
    };
  }
}
