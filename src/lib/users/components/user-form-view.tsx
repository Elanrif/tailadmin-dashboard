"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { userByIdQueryOptions } from "../api/queries/queries.client";
import { UserForm } from "./ui/user-form";

type TUserViewPageProps = {
  userId: string;
  onSaved?: () => void;
};

export default function UserFormView({ userId, onSaved }: TUserViewPageProps) {
  if (userId === "new") {
    return (
      <UserForm
        initialData={null}
        pageTitle="Create New User"
        onSaved={onSaved}
      />
    );
  }

  const numericId = Number(userId);
  if (Number.isNaN(numericId)) {
    notFound();
    return null;
  }

  return <EditUserView userId={Number(userId)} onSaved={onSaved} />;
}

function EditUserView({
  userId,
  onSaved,
}: {
  userId: number;
  onSaved?: () => void;
}) {
  const { data } = useSuspenseQuery(userByIdQueryOptions(userId));

  return (
    <UserForm initialData={data} pageTitle="Edit User" onSaved={onSaved} />
  );
}
