import { Meta } from "@/lib/shared/types";
import { UserSummary } from "@/lib/users/api/types";

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Comment {
  id: number;
  content: string;
  postId: number;
  author: UserSummary;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// REQUEST & RESPONSE TYPES
// ============================================================================

export type CommentFilters = {
  postId?: number;
  authorId?: number;
  page?: number;
  limit?: number;
  size?: number;
  search?: string;
  sort?: string;
};

export type CommentsResponse = {
  data: Comment[];
  meta: Meta;
};

export type CommentsResult = CommentsResponse;

// ============================================================================
// MUTATION PAYLOADS
// ============================================================================

export interface CommentCreate {
  content: string;
  postId: number;
  authorId: number;
}

export type CommentUpdate = Partial<CommentCreate>;
