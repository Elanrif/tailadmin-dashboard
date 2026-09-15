import { NextRequest, NextResponse } from "next/server";

import {
  deleteUserAddress,
  getUserAddress,
  updateAddress,
} from "@/lib/addresses/api/services/address.server";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: "Invalid address id",
          status: 400,
        },
      },
      { status: 400 },
    );
  }

  const response = await getUserAddress(_id);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: "Invalid address id",
          status: 400,
        },
      },
      { status: 400 },
    );
  }
  const payload = await req.json();

  const response = await updateAddress(_id, payload);

  return NextResponse.json(response, {
    status: response.ok ? 200 : (response.error.status ?? 500),
  });
}

export async function DELETE(_: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const _id = Number.parseInt(id, 10);
  if (Number.isNaN(_id)) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: "Invalid address id",
          status: 400,
        },
      },
      { status: 400 },
    );
  }

  const response = await deleteUserAddress(_id);

  return NextResponse.json(null, {
    status: response.ok ? 204 : (response.error.status ?? 500),
  });
}
