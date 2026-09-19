import { NextResponse } from "next/server";
import { getMyProfile } from "@/lib/account/api/services/account.server";

export const dynamic = "force-dynamic";

export async function GET() {
  const response = await getMyProfile();

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}
