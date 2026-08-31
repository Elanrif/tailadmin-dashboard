"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { Comment } from "../api/types";
import { commentByIdOptions } from "../api/queries/queries.client";
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
}: CommentFormViewProps & CommentsQueryProps) {
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

  return (
    <EditCommentView
      commentId={Number(commentId)}
      hiddenFields={{ postId, authorId }}
      onSaved={onSaved}
    />
  );
}

function EditCommentView({
  commentId,
  hiddenFields: { postId, authorId } = {},
  onSaved,
}: {
  commentId: number;
  onSaved?: () => void;
  hiddenFields?: CommentsQueryProps["queryParams"];
}) {
  const { data } = useSuspenseQuery(commentByIdOptions(commentId));

  if (!data?.ok || !data.data) {
    notFound();
  }

  return (
    <CommentForm
      initialData={data.data as Comment}
      pageTitle="Edit Comment"
      onSaved={onSaved}
      hiddenFields={{ postId, authorId }}
    />
  );
}
