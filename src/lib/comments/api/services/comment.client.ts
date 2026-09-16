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
import { unwrapApiError } from "@/lib/shared/handle-api-error";

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
): Promise<CommentsResponse> {
  try {
    const { data } = await frontendHttp().get<CommentsResponse>(commentsUrl, {
      params: filters,
    });
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function fetchCommentById(id: number): Promise<Comment> {
  try {
    const { data } = await frontendHttp().get<Comment>(`${commentsUrl}/${id}`);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

// --- Mutations ---

export async function createComment(
  payload: CommentFormValues,
): Promise<Comment> {
  try {
    const { data } = await frontendHttp().post<Comment>(commentsUrl, payload);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function updateComment(
  id: number,
  payload: CommentUpdateFormValues,
): Promise<Comment> {
  try {
    const { data } = await frontendHttp().patch<Comment>(
      `${commentsUrl}/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function deleteComment(id: number): Promise<void> {
  try {
    await frontendHttp().delete(`${commentsUrl}/${id}`);
  } catch (error) {
    throw unwrapApiError(error);
  }
}
