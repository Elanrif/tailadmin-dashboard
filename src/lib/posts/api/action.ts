"use server";

import { revalidatePath } from "next/cache";
import { Post } from "./types";
import { createPost, deletePost, updatePost } from "./services/post.server";
import { PostCreatePayload, PostUpdatePayload } from "../schemas/post";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

export async function createPostAction(
  data: PostCreatePayload,
): Promise<Result<Post, ApiError>> {
  const result = await createPost(data);
  if (result.ok) {
    revalidatePath("/dashboard/posts");
  }
  return result;
}

export async function updatePostAction(
  id: number,
  data: PostUpdatePayload,
): Promise<Result<Post, ApiError>> {
  const result = await updatePost(id, data);
  if (result.ok) {
    revalidatePath("/dashboard/posts");
  }
  return result;
}

export async function deletePostAction(
  id: number,
): Promise<Result<void, ApiError>> {
  const result = await deletePost(id);
  if (result.ok) {
    revalidatePath("/dashboard/posts");
  }
  return result;
}
