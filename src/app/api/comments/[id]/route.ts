import { NextRequest, NextResponse } from "next/server";
import { getCommentById } from "@/lib/comments/api/services/comment.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid address id", status: 400 } },
      { status: 400 },
    );
  }
  const response = await getCommentById(_id);
  const status = !response.ok ? (response.error.status ?? 500) : 200;
  return NextResponse.json(response, { status });
}
