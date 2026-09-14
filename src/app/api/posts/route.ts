import { NextRequest, NextResponse } from "next/server";
import { PostFilters } from "@/lib/posts/api/types";
import { getPosts } from "@/lib/posts/api/services/post.server";
import { parseIntParam } from "@/utils/query-params";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const filters: PostFilters = {
    page: parseIntParam(sp.get("page")),
    size: parseIntParam(sp.get("size") ?? sp.get("perPage")),
    authorId: parseIntParam(sp.get("authorId")),
    search: sp.get("search") ?? undefined,
    sort: sp.get("sort") ?? undefined,
  };

  const response = await getPosts(filters);
  const status = !response.ok ? (response.error.status ?? 500) : 200;
  return NextResponse.json(response, { status });
}
