"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { postByIdQueryOptions } from "../api/queries/queries.client";
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

  const numericId = Number(postId);
  if (Number.isNaN(numericId)) {
    notFound();
    return null;
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
  const { data } = useSuspenseQuery(postByIdQueryOptions(postId));

  return (
    <PostForm initialData={data} pageTitle="Edit Post" onSaved={onSaved} />
  );
}
