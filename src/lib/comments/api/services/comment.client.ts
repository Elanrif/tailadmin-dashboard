import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import {
  Comment,
  CommentFilters,
  CommentsResponse,
} from "@/lib/comments/api/types";
import {
  CommentFormValues,
  CommentUpdateFormValues,
} from "../../schemas/comment";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { comments: commentsUrl },
    },
  },
} = proxyEnvironment;

// --- Queries ---

export async function fetchComments(
  filters?: CommentFilters,
): Promise<Result<CommentsResponse, ApiError>> {
  const { data } = await frontendHttp().get<Result<CommentsResponse, ApiError>>(
    commentsUrl,
    { params: filters },
  );

  return data;
}

export async function fetchCommentById(
  id: number,
): Promise<Result<Comment, ApiError>> {
  const { data } = await frontendHttp().get<Result<Comment, ApiError>>(
    `${commentsUrl}/${id}`,
  );

  return data;
}

// --- Mutations ---

export async function createComment(
  payload: CommentFormValues,
): Promise<Result<Comment, ApiError>> {
  const { data } = await frontendHttp().post<Result<Comment, ApiError>>(
    commentsUrl,
    payload,
  );

  return data;
}

export async function updateComment(
  id: number,
  payload: CommentUpdateFormValues,
): Promise<Result<Comment, ApiError>> {
  const { data } = await frontendHttp().patch<Result<Comment, ApiError>>(
    `${commentsUrl}/${id}`,
    payload,
  );

  return data;
}

export async function deleteComment(
  id: number,
): Promise<Result<void, ApiError>> {
  const { data } = await frontendHttp().delete<Result<void, ApiError>>(
    `${commentsUrl}/${id}`,
  );

  return data;
}
