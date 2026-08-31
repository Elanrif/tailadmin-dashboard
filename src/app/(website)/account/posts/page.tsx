"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useSession } from "@/lib/auth/components/auth.context";
import { Posts } from "@/lib/posts/components/posts";

export default function PostsPage() {
  const {user} = useSession();
  return (
    <div>
      <PageBreadcrumb pageTitle="Posts" />
      <div className="space-y-6">
        <ComponentCard>
          <Posts queryParams={{ authorId : user?.id }}/>
        </ComponentCard>
      </div>
    </div>
  );
}
