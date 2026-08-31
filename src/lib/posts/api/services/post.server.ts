"server-only";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";

import { Post, PostFilters, PostsResponse } from "@/lib/posts/api/types";

import {
  PostCreatePayload,
  PostUpdatePayload,
  postCreateSchema,
  postUpdateSchema,
} from "@/lib/posts/schemas/post";
import { validateId } from "@/utils";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

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
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value != null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = params.toString()
      ? `${postsUrl}?${params.toString()}`
      : postsUrl;

    const response = await apiClient().get<PostsResponse>(url);

    logger.info(
      {
        filters,
        count: response.data.meta.total,
      },
      "Posts fetched",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getPosts"),
    };
  }
}

export async function createPost(
  post: PostCreatePayload,
): Promise<Result<Post, ApiError>> {
  const parse = postCreateSchema.safeParse(post);

  // Zod validation is performed before calling the backend.
  // The error is already known locally, so it is returned directly
  // as an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        errors: parse.error.format(),
      },
      "Post creation validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    const response = await apiClient().post<Post>(postsUrl, parse.data);

    logger.info(
      {
        id: response.data.id,
      },
      "Post created",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "createPost"),
    };
  }
}

export async function getPostById(id: number): Promise<Result<Post, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  try {
    const response = await apiClient().get<Post>(postUrl(id));

    logger.info({ id }, "Post fetched");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getPostById"),
    };
  }
}

export async function updatePost(
  id: number,
  post: PostUpdatePayload,
): Promise<Result<Post, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  const parse = postUpdateSchema.safeParse(post);

  // Zod validation is performed before calling the backend.
  // The error is already known locally, so it is returned directly
  // as an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        errors: parse.error.format(),
      },
      "Post update validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    const response = await apiClient().patch<Post>(
      postUrl(id),
      parse.data,
    );

    logger.info({ id }, "Post updated");

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "updatePost"),
    };
  }
}

export async function deletePost(
  id: number,
): Promise<Result<void, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  try {
    await apiClient().delete(postUrl(id));

    logger.info({ id }, "Post deleted");

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "deletePost"),
    };
  }
}
