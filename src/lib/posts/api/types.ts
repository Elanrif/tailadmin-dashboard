import { Comment } from "@/lib/comments/api/types";
import { PageResponse } from "@/lib/shared/types";
import { UserSummary } from "@/lib/users/api/types";

export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  author: UserSummary;
  numberOfComments?: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export type PostsResponse = PageResponse<Post>;

export type TogglePostLikeResponse = {
  likes: number;
  liked: boolean;
};

export type PostFilters = {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
  authorId?: number;
};
