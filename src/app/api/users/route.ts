import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/users/api/services/user.server";
import type { UserFilters } from "@/lib/users/api/types";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  const sp =
    _request.nextUrl?.searchParams ?? new URL(_request.url).searchParams;
  const filters: UserFilters = {
    page: sp.has("page") ? Number(sp.get("page")) : undefined,
    size: sp.has("size")
      ? Number(sp.get("size"))
      : sp.has("perPage")
        ? Number(sp.get("perPage"))
        : undefined,
    role: sp.get("role") ?? undefined,
    status: sp.get("status") ?? undefined,
    search: sp.get("search") ?? undefined,
    sort: sp.get("sort") ?? undefined,
  };

  const response = await getUsers(filters);
  /**
   * Always return 200 OK (even on business logic errors).
   * The HTTP status only indicates network/server transport success.
   * Actual business logic errors (validation, FK violation, etc) are in response.ok:
   *   - response.ok = true: operation succeeded
   *   - response.ok = false: operation failed, see response.error for details
   * This prevents Axios from throwing exceptions for business errors.
   */
  return NextResponse.json(response, { status: 200 });
}

/**
 *  ⚠️Methods below are not used, just an example if we want to call API routes directly,
 *  from client components without going through server actions.
 *  ✅We use server actions for mutations to leverage revalidation
 *  and avoid handling client-side state management (loading, error).
 * @param user
 * @returns
 */

// export async function POST(request: NextRequest) {
//   const body = await request.json().catch(() => null);
//   const response = await createUser(body);
//   return NextResponse.json(response, { status: 200 });
// }
