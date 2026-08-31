import ComponentCard from "@/components/common/ComponentCard";
import { Metadata } from "next";
import Posts from "./_components/posts";

export const metadata: Metadata = {
  title: "Posts | TailAdmin",
  description: "Manage posts",
};

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <ComponentCard>
        <Posts />
      </ComponentCard>
    </div>
  );
}
