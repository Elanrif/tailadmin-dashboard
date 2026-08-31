"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { Post } from "../api/types";
import { postByIdOptions } from "../api/queries/queries.client";
import { PostForm } from "./ui/post-form";
import { PostQueryProps } from "./posts";

type TPostViewPageProps = {
  postId: string;
  hiddenFields: PostQueryProps["queryParams"];
  onSaved?: () => void;
};

export default function PostFormView({
  postId,
  onSaved,
  hiddenFields: { authorId } = {},
}: TPostViewPageProps) {
  if (postId === "new") {
    return (
      <PostForm
        initialData={null}
        pageTitle="Create New Post"
        onSaved={onSaved}
        hiddenFields={{ authorId }}
      />
    );
  }

  return <EditPostView postId={Number(postId)} onSaved={onSaved} />;
}

function EditPostView({
  postId,
  onSaved,
}: {
  postId: number;
  onSaved?: () => void;
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
    />
  );
}
