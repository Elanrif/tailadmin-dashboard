import ComponentCard from "@/components/common/ComponentCard";
import Posts from "@/components/website/home/posts";
import { Metadata } from "next";

// By default, Next.js tries to statically render this page at build time
// (Static Site Generation), since nothing here signals otherwise. To do
// that, it renders the component tree on the server during `next build` —
// and this happens even though <Posts /> is a "use client" component,
// because Next.js still needs to produce the initial static HTML for it.
//
// The problem: <Posts /> uses `useSuspenseQuery`, which fires an API call
// as soon as it renders. So during that build-time static render, Next.js
// ends up making a real network request to our own API proxy
// (http://localhost:3000/api/...) — but at build time, no Next.js server
// is actually running yet to receive that request. Result: ECONNREFUSED,
// and the build fails.
//
// `force-dynamic` tells Next.js to skip static generation for this route
// entirely and always render it on-demand, at request time (runtime),
// once the server is fully up and able to handle the proxy call.
export const dynamic = "force-dynamic";

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
