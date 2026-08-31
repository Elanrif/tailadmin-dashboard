"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Post } from "../api/types";
import { postByIdOptions } from "../api/queries/queries.client";
import PostDetails from "./post-details";
import { PostForm } from "./ui/post-form";

type TPostViewPageProps = {
  postId: string;
  onSaved?: () => void;
  authorId?: number;
  redirectOnSave?: boolean;
};

export default function PostFormView({
  postId,
  onSaved,
  authorId,
  redirectOnSave = true,
}: TPostViewPageProps) {
  if (postId === "new") {
    return (
      <PostForm
        initialData={null}
        pageTitle="Create New Post"
        onSaved={onSaved}
        authorId={authorId}
        redirectOnSave={redirectOnSave}
      />
    );
  }

  return (
    <EditPostView
      postId={Number(postId)}
      onSaved={onSaved}
      redirectOnSave={redirectOnSave}
    />
  );
}

function EditPostView({
  postId,
  onSaved,
  redirectOnSave,
}: {
  postId: number;
  onSaved?: () => void;
  redirectOnSave: boolean;
}) {
  const { data } = useSuspenseQuery(postByIdOptions(postId));

  if (!data?.ok || !data?.data) {
    notFound();
  }

  return (
    <PostForm
      initialData={data.data as Post}
      pageTitle="Edit Post"
      onSaved={onSaved}
      redirectOnSave={redirectOnSave}
    />
  );
}
