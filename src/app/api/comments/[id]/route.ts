import { NextRequest, NextResponse } from "next/server";
import {
  deleteComment,
  getCommentById,
  updateComment,
} from "@/lib/comments/api/services/comment.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid comment id", status: 400 } },
      { status: 400 },
    );
  }
  const response = await getCommentById(_id);

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid comment id", status: 400 } },
      { status: 400 },
    );
  }
  const payload = await req.json();

  const response = await updateComment(_id, payload);

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid comment id", status: 400 } },
      { status: 400 },
    );
  }

  const response = await deleteComment(_id);

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return new NextResponse(null, { status: 204 });
}
