"server-only";

import { AxiosResponse } from "axios";
import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  Comment,
  CommentCreate,
  CommentFilters,
  CommentUpdate,
  CommentsResult,
} from "@/lib/comments/api/types";
import {
  parseCommentApiCreate,
  parseCommentApiUpdate,
} from "@/lib/comments/schemas/comment";
import { validateId } from "@/utils";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

/**
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
const {
  api: {
    rest: {
      endpoints: { comments: commentsUrl },
    },
  },
} = environment;

const logger = getLogger("server");

export async function getComments(
  filters?: CommentFilters,
): Promise<Result<CommentsResult, ApiError>> {
  try {
    const res = await apiClient().get<unknown, AxiosResponse<CommentsResult>>(
      commentsUrl,
      {
        params: filters,
      },
    );

    logger.debug({ count: res.data?.data?.length || 0 }, "Comments fetched");

    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getComments"),
    };
  }
}

export async function getCommentById(
  id: number,
): Promise<Result<Comment, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  try {
    const res = await apiClient().get<unknown, AxiosResponse<Comment>>(
      `${commentsUrl}/${id}`,
    );

    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getCommentById"),
    };
  }
}

export async function createComment(
  comment: CommentCreate,
): Promise<Result<Comment, ApiError>> {
  const parse = parseCommentApiCreate(comment);

  // Zod validation is performed before calling the backend.
  // The validation error is already known locally, so we return
  // it directly as an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        errors: parse.error.format(),
      },
      "Comment creation validation failed",
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
    const res = await apiClient().post<unknown, AxiosResponse<Comment>>(
      commentsUrl,
      parse.data,
    );

    logger.info(
      {
        id: res.data.id,
        content: res.data.content,
      },
      "Comment created successfully",
    );

    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "createComment"),
    };
  }
}

export async function updateComment(
  id: number,
  comment: CommentUpdate,
): Promise<Result<Comment, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  const parse = parseCommentApiUpdate(comment);

  // Zod validation is performed before calling the backend.
  // The validation error is already known locally, so we return
  // it directly as an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        errors: parse.error.format(),
      },
      "Comment update validation failed",
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
    const res = await apiClient().patch<unknown, AxiosResponse<Comment>>(
      `${commentsUrl}/${id}`,
      parse.data,
    );

    logger.info(
      {
        id,
        content: res.data.content,
      },
      "Comment updated successfully",
    );

    return {
      ok: true,
      data: res.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "updateComment"),
    };
  }
}

export async function deleteComment(
  id: number,
): Promise<Result<{ success: boolean }, ApiError>> {
  const idError = validateId(id);

  if (idError) return idError;

  try {
    await apiClient().delete(`${commentsUrl}/${id}`);

    logger.info({ id }, "Comment deleted successfully");

    return {
      ok: true,
      data: { success: true },
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "deleteComment"),
    };
  }
}
