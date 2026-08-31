/**
 * Post types — API response models (no validation)
 * See: src/lib/posts/schemas/post.schema.ts for form validation
 */

import { Comment } from "@/lib/comments/api/types";
import { Meta } from "@/lib/shared/types";
import { UserSummary } from "@/lib/users/api/types";

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface Post {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  likes: number;
  author: UserSummary;
  commentSize?: number;
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export type PostsResponse = {
  data: Post[];
  meta: Meta;
};

// ============================================================================
// REQUEST & RESPONSE TYPES
// ============================================================================

export type PostFilters = {
  page?: number;
  size?: number;
  search?: string;
  sort?: string;
  authorId?: number;
};

export type PostCreate = {
  title: string;
  description?: string;
  imageUrl?: string;
  likes: number;
  authorId?: number;
};

export type PostUpdate = Partial<PostCreate>;
