import { NextRequest, NextResponse } from "next/server";
import { getUserAddress } from "@/lib/addresses/api/services/address.server";


export const dynamic = "force-dynamic";

type Params = Promise<{ addressId: string }>;

export async function GET(_request: NextRequest, {params}: {params: Params}) {
  const {addressId} = await params;
  const id = Number.parseInt(addressId, 10);

  const response = await getUserAddress(id);
  /**
   * Always return 200 OK (even on business logic errors).
   * The HTTP status only indicates network/server transport success.
   * Actual business logic errors (validation, FK violation, etc) are in response.ok:
   *   - response.ok = true: operation succeeded
   *   - response.ok = false: operation failed, see response.error for details
   * This prevents Axios from throwing exceptions for business errors.
   */
  return NextResponse.json(response, { status: 200 });
}