import ComponentCard from "@/components/common/ComponentCard";
import PostDetails from "@/lib/posts/components/post-details";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <div className="space-y-6">
        <ComponentCard>
          <PostDetails postId={Number(id)} />
        </ComponentCard>
      </div>
    </div>
  );
}
