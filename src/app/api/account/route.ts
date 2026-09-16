import { NextRequest, NextResponse } from "next/server";
import {
  changeMyPassword,
  deleteMyAccount,
  updateMyProfile,
} from "@/lib/account/api/services/account.server";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  const payload = await req.json();
  const response = await updateMyProfile(payload);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}

export async function DELETE(req: NextRequest) {
  const payload = await req.json();
  const response = await deleteMyAccount(payload);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const response = await changeMyPassword(payload);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}
