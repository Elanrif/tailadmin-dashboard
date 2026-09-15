import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth/api/services/auth.server";
import { LoginFormValues } from "@/lib/auth/schemas/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as LoginFormValues;
  const response = await signIn(body);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}
