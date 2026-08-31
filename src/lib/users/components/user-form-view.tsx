"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { User } from "../api/types";
import { userByIdOptions } from "../api/queries/queries.client";
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

  return <EditUserView userId={Number(userId)} onSaved={onSaved} />;
}

function EditUserView({
  userId,
  onSaved,
}: {
  userId: number;
  onSaved?: () => void;
}) {
  const { data } = useSuspenseQuery(userByIdOptions(userId));

  if (!data?.ok || !data?.data) {
    notFound();
  }
  return (
    <UserForm
      initialData={data.data as User}
      pageTitle="Edit User"
      onSaved={onSaved}
    />
  );
}
