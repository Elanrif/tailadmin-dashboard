import { NextRequest, NextResponse } from "next/server";
import { togglePostLike } from "@/lib/posts/api/services/post.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function POST(_: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const postId = Number.parseInt(id, 10);

  if (Number.isNaN(postId)) {
    return NextResponse.json(
      { message: "Invalid post id", status: 400 },
      { status: 400 },
    );
  }

  const response = await togglePostLike(postId);

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }

  return NextResponse.json(response.data, { status: 200 });
}
