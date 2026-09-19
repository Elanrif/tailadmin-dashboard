"server-only";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import {
  Comment,
  CommentFilters,
  CommentsResponse,
} from "@/lib/comments/api/types";
import { checkValidId } from "@/utils";
import { Result } from "@/lib/shared/types";
import { ApiError, fromZodError } from "@/lib/shared/api-error";
import {
  commentCreateSchema,
  CommentFormValues,
  CommentUpdateFormValues,
  commentUpdateSchema
} from "../../schemas/comment";

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
): Promise<Result<CommentsResponse, ApiError>> {
  try {
    const res = await apiClient().get<CommentsResponse>(
      commentsUrl,
      { params: filters },
    );

    logger.debug({ count: res.data?.content?.length || 0 }, "Comments fetched");

    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, error: ApiError(error, "getComments") };
  }
}

export async function getCommentById(
  id: number,
): Promise<Result<Comment, ApiError>> {
  const idCheck = checkValidId(id, "comment");
  if (idCheck) return idCheck;

  try {
    const res = await apiClient().get<Comment>(
      `${commentsUrl}/${id}`,
    );

    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, error: ApiError(error, "getCommentById") };
  }
}

export async function createComment(
  comment: CommentFormValues,
): Promise<Result<Comment, ApiError>> {
  const parse = commentCreateSchema.safeParse(comment);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "Comment creation"),
    };
  }

  try {
    const res = await apiClient(true).post<Comment>(
      commentsUrl,
      parse.data,
    );

    logger.info(
      { id: res.data.id, content: res.data.content },
      "Comment created successfully",
    );

    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, error: ApiError(error, "createComment") };
  }
}

export async function updateComment(
  id: number,
  comment: CommentUpdateFormValues,
): Promise<Result<Comment, ApiError>> {
  const idCheck = checkValidId(id, "comment");
  if (idCheck) return idCheck;

  const parse = commentUpdateSchema.safeParse(comment);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "Comment update"),
    };
  }

  try {
    const res = await apiClient(true).patch<Comment>(
      `${commentsUrl}/${id}`,
      parse.data,
    );

    logger.info(
      { id, content: res.data.content },
      "Comment updated successfully",
    );

    return { ok: true, data: res.data };
  } catch (error) {
    return { ok: false, error: ApiError(error, "updateComment") };
  }
}

export async function deleteComment(
  id: number,
): Promise<Result<void, ApiError>> {
  const idCheck = checkValidId(id, "comment");
  if (idCheck) return idCheck;

  try {
    await apiClient(true).delete(`${commentsUrl}/${id}`);
    logger.info({ id }, "Comment deleted successfully");
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: ApiError(error, "deleteComment") };
  }
}
