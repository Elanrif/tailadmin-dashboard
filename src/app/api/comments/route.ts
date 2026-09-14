import { NextRequest, NextResponse } from "next/server";
import { CommentFilters } from "@/lib/comments/api/types";
import { getComments } from "@/lib/comments/api/services/comment.server";
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
  const status = !response.ok ? (response.error.status ?? 500) : 200;
  return NextResponse.json(response, { status });
}
