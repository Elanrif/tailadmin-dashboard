"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { Comment } from "../api/types";
import { commentByIdOptions } from "../api/queries/queries.client";
import { CommentForm } from "./ui/comment-form";

type CommentFormViewProps = {
  commentId: string;
  postId?: number;
  authorId?: number;
  onSaved?: () => void;
};

export default function CommentFormView({
  commentId,
  postId,
  authorId,
  onSaved,
}: CommentFormViewProps) {
  if (commentId === "new") {
    return (
      <CommentForm
        initialData={null}
        pageTitle="Create New Comment"
        postId={postId}
        authorId={authorId}
        onSaved={onSaved}
      />
    );
  }

  return (
    <EditCommentView
      commentId={Number(commentId)}
      postId={postId}
      authorId={authorId}
      onSaved={onSaved}
    />
  );
}

function EditCommentView({
  commentId,
  postId,
  authorId,
  onSaved,
}: {
  commentId: number;
  postId?: number;
  authorId?: number;
  onSaved?: () => void;
}) {
  const { data } = useSuspenseQuery(commentByIdOptions(commentId));

  if (!data?.ok || !data.data) {
    notFound();
  }

  return (
    <CommentForm
      initialData={data.data as Comment}
      pageTitle="Edit Comment"
      postId={postId}
      authorId={authorId}
      onSaved={onSaved}
    />
  );
}
