import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Comment, CommentFilters, CommentsResponse } from "../types";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { comments: commentsUrl },
    },
  },
} = proxyEnvironment;

export async function fetchComments(
  filters?: CommentFilters,
): Promise<Result<CommentsResponse, ApiError>> {
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<CommentsResponse, ApiError>>
  >(commentsUrl, { params: filters });
  return res.data;
}

export async function fetchCommentById(
  id: number,
): Promise<Result<Comment, ApiError>> {
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<Comment, ApiError>>
  >(`${commentsUrl}/${id}`);
  return res.data;
}
