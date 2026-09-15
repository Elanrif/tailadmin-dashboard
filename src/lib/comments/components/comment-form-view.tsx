"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { commentByIdQueryOptions } from "../api/queries/queries.client";
import { CommentForm } from "./ui/comment-form";
import { CommentsQueryProps } from "./comments";

type CommentFormViewProps = {
  commentId: string;
  hiddenFields?: CommentsQueryProps["queryParams"];
  onSaved?: () => void;
};

export default function CommentFormView({
  commentId,
  onSaved,
  hiddenFields: { postId, authorId } = {},
}: CommentFormViewProps) {
  if (commentId === "new") {
    return (
      <CommentForm
        initialData={null}
        pageTitle="Create New Comment"
        hiddenFields={{ postId, authorId }}
        onSaved={onSaved}
      />
    );
  }

  const numericId = Number(commentId);
  if (Number.isNaN(numericId)) {
    notFound();
    return null;
  }

  return (
    <EditCommentView
      commentId={numericId}
      hiddenFields={{ postId, authorId }}
      onSaved={onSaved}
    />
  );
}

type EditCommentViewProps = {
  commentId: number;
  onSaved?: () => void;
  hiddenFields?: CommentsQueryProps["queryParams"];
};

function EditCommentView({
  commentId,
  hiddenFields: { postId, authorId } = {},
  onSaved,
}: EditCommentViewProps) {
  const { data } = useSuspenseQuery(commentByIdQueryOptions(commentId));

  return (
    <CommentForm
      initialData={data}
      pageTitle="Edit Comment"
      onSaved={onSaved}
      hiddenFields={{ postId, authorId }}
    />
  );
}
