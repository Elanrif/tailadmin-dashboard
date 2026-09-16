import { NextRequest, NextResponse } from "next/server";
import { forgotPassword } from "@/lib/auth/api/services/auth.server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email?: string };
  const response = await forgotPassword(body.email ?? "");

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}
