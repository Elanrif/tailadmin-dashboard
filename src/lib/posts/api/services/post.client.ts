import { AxiosResponse } from "axios";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { proxyEnvironment } from "@config/proxy-api.config";
import { Post, PostFilters, PostsResponse } from "@/lib/posts/api/types";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";
const {
  api: {
    rest: {
      endpoints: { posts: postsUrl },
    },
  },
} = proxyEnvironment;

export async function fetchPosts(
  filters?: PostFilters,
): Promise<Result<PostsResponse, ApiError>> {
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<PostsResponse, ApiError>>
  >(postsUrl, { params: filters });
  return res.data;
}

export async function fetchPostById(
  id: number,
): Promise<Result<Post, ApiError>> {
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<Post, ApiError>>
  >(`${postsUrl}/${id}`);
  return res.data;
}
