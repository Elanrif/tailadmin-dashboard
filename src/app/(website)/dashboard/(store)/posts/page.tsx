import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Posts } from "@/lib/posts/components/posts";
import { searchParamsCache } from "@/lib/searchparams";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts | TailAdmin",
  description: "Manage posts",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParamsCache.parse(searchParams);
  return (
    <div>
      <PageBreadcrumb pageTitle="Posts" />
      <div className="space-y-6">
        <ComponentCard>
          <Posts />
        </ComponentCard>
      </div>
    </div>
  );
}
