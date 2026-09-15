import { NextRequest, NextResponse } from "next/server";
import { CommentFilters } from "@/lib/comments/api/types";
import { createComment, getComments } from "@/lib/comments/api/services/comment.server";
import { parseIntParam } from "@/utils/query-params";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filters: CommentFilters = {
    postId: parseIntParam(searchParams.get("postId")),
    authorId: parseIntParam(searchParams.get("authorId")),
    page: parseIntParam(searchParams.get("page")),
    size: parseIntParam(searchParams.get("size")),
    sort: searchParams.get("sort") ?? undefined,
  };

  const response = await getComments(filters);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const response = await createComment(payload);

  return NextResponse.json(response, {
    status: response.ok ? 201 : (response.error.status ?? 500),
  });
}
