import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth/api/services/auth.server";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  const response = await logout();

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}
