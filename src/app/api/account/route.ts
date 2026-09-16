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

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const payload = await req.json();
  const response = await deleteMyAccount(payload);

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}

export async function POST(req: NextRequest) {
  const payload = await req.json();
  const response = await changeMyPassword(payload);

  if (!response.ok) {
    return NextResponse.json(response.error, {
      status: response.error.status ?? 500,
    });
  }
  return NextResponse.json(response.data, { status: 200 });
}
