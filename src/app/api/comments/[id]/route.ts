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

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
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

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
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

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}
