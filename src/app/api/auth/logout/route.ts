import { NextRequest, NextResponse } from "next/server";
import { logout } from "@/lib/auth/api/services/auth.server";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  const response = await logout();

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}
