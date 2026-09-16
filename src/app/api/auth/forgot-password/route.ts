import { NextRequest, NextResponse } from "next/server";
import { forgotPassword } from "@/lib/auth/api/services/auth.server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email?: string };
  const response = await forgotPassword(body.email ?? "");

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}
