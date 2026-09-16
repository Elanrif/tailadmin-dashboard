import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth/api/services/auth.server";
import { LoginFormValues } from "@/lib/auth/schemas/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as LoginFormValues;
  const response = await signIn(body);

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}
