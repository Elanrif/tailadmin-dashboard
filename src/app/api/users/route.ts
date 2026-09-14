import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/users/api/services/user.server";
import type { UserFilters } from "@/lib/users/api/types";
import { parseIntParam } from "@/utils/query-params";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const filters: UserFilters = {
    page: parseIntParam(sp.get("page")),
    size: parseIntParam(sp.get("size") ?? sp.get("perPage")),
    role: sp.get("role") ?? undefined,
    status: sp.get("status") ?? undefined,
    search: sp.get("search") ?? undefined,
    sort: sp.get("sort") ?? undefined,
  };

  const response = await getUsers(filters);
  const status = !response.ok ? (response.error.status ?? 500) : 200;
  return NextResponse.json(response, { status });
}
