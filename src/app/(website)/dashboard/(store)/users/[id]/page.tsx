import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { searchParamsCache } from "@/lib/searchparams";
import UserDetails from "@/lib/users/components/user-details";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Add Users | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Add Users page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default async function AddUsersPage({
  searchParams,
  params,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await searchParamsCache.parse(searchParams);

  return (
    <div>
      <PageBreadcrumb pageTitle="Add new Users" />
      <div className="space-y-6">
        <ComponentCard>
          <UserDetails userId={Number(id)} />
        </ComponentCard>
      </div>
    </div>
  );
}
