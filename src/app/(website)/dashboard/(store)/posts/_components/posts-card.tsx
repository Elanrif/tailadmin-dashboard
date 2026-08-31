import { Post } from "@/lib/posts/api/types";

export default function PostsCard({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded-lg border border-gray-300 p-4 shadow-sm"
        >
          <h2 className="mb-2 text-lg font-semibold">{post.title}</h2>
          <p className="mb-2 text-gray-600">{post.description}</p>
          <p className="text-sm text-gray-500">Author ID: {post.author?.id}</p>
        </div>
      ))}
    </div>
  );
}
