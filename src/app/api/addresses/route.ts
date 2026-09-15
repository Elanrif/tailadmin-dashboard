import { NextRequest, NextResponse } from "next/server";
import {
  createUserAddress,
  getUserAddresses,
} from "@/lib/addresses/api/services/address.server";
import { AddressFilters } from "@/lib/addresses/api/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl?.searchParams ?? new URL(request.url).searchParams;
  const filters: AddressFilters = {
    current: sp.has("current") ? Number(sp.get("current")) : undefined,
    limit: sp.has("limit")
      ? Number(sp.get("limit"))
      : sp.has("perPage")
        ? Number(sp.get("perPage"))
        : undefined,
    userId: sp.has("userId") ? Number(sp.get("userId")) : undefined,
    country: sp.get("country") ?? undefined,
    city: sp.get("city") ?? undefined,
    search: sp.get("search") ?? undefined,
    sort: sp.get("sort") ?? undefined,
  };

  const response = await getUserAddresses(filters);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const response = await createUserAddress(payload);

  return NextResponse.json(response, {
    status: response.ok ? 201 : (response.error.status ?? 500),
  });
}
