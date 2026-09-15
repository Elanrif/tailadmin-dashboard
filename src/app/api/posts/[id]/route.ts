import { NextRequest, NextResponse } from "next/server";
import {
  deletePost,
  getPostById,
  updatePost,
} from "@/lib/posts/api/services/post.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      { ok: false, error: { message: "Invalid post id", status: 400 } },
      { status: 400 },
    );
  }
  const response = await getPostById(_id);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: "Invalid post id",
          status: 400,
        },
      },
      { status: 400 },
    );
  }
  const payload = await req.json();

  const response = await updatePost(_id, payload);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}

export async function DELETE(_req: Request, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: "Invalid post id",
          status: 400,
        },
      },
      { status: 400 },
    );
  }

  const response = await deletePost(_id);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}
