import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Comments } from "@/lib/comments/components/comments";
import { searchParamsCache } from "@/lib/searchparams";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comments | TailAdmin",
  description: "Manage comments",
};

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParamsCache.parse(searchParams);
  return (
    <div>
      <PageBreadcrumb pageTitle="Comments" />
      <div className="space-y-6">
        <ComponentCard>
          <Comments />
        </ComponentCard>
      </div>
    </div>
  );
}
