import { mutationOptions } from "@tanstack/react-query";
import { postKeys } from "./queries";
import { PostCreatePayload, PostUpdatePayload } from "../schemas/post";
import { getQueryClient } from "@/lib/query-client";
import { createPostAction, deletePostAction, updatePostAction } from "./action";

export const createPostMutation = mutationOptions({
  mutationFn: (data: PostCreatePayload) => createPostAction(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const updatePostMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: PostUpdatePayload }) =>
    updatePostAction(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});

export const deletePostMutation = mutationOptions({
  mutationFn: (id: number) => deletePostAction(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: postKeys.all });
  },
});
