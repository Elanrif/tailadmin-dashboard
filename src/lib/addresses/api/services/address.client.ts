import { AxiosResponse } from "axios";
import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { Address, AddressesResponse, AddressFilters } from "../types";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { addresses: addressesUrl },
    },
  },
} = proxyEnvironment;

export async function fetchUserAddresses(
  filters: AddressFilters = {},
): Promise<Result<AddressesResponse, ApiError>> {
  const cleanParams: Record<string, string> = {};

  // Filter keys are mapped directly to URL search parameters.
  // => /addresses?filters.key1=filters.value1&filters.key2=filters.value2
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      cleanParams[key] = String(value);
    }
  }

  const queryParams = new URLSearchParams(cleanParams).toString();
  const url = `${addressesUrl}${queryParams ? `?${queryParams}` : ""}`;
  console.log("fetchUserAddresses URL:", url); // Debugging line
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<AddressesResponse, ApiError>>
  >(url);

  return res.data;
}

export async function fetchUserAddressById(
  addressId: number,
): Promise<Result<Address, ApiError>> {
  const res = await frontendHttp().get<
    unknown,
    AxiosResponse<Result<Address, ApiError>>
  >(`${addressesUrl}/${addressId}`);

  return res.data;
}

export async function createUserAddressClient(
  userId: number,
  payload: Partial<Address>,
): Promise<Result<Address, ApiError>> {
  const res = await frontendHttp().post<
    unknown,
    AxiosResponse<Result<Address, ApiError>>
  >(`${addressesUrl}/user/${userId}`, payload);

  return res.data;
}

export async function updateAddressClient(
  addressId: number,
  payload: Partial<Address>,
): Promise<Result<Address, ApiError>> {
  const res = await frontendHttp().patch<
    unknown,
    AxiosResponse<Result<Address, ApiError>>
  >(`${addressesUrl}/${addressId}`, payload);

  return res.data;
}

export async function deleteUserAddressClient(
  addressId: number,
): Promise<Result<void, ApiError>> {
  const res = await frontendHttp().delete<
    unknown,
    AxiosResponse<Result<void, ApiError>>
  >(`${addressesUrl}/${addressId}`);

  return res.data;
}

export async function setDefaultAddressClient(
  userId: number,
  addressId: number,
): Promise<Result<void, ApiError>> {
  const res = await frontendHttp().post<
    unknown,
    AxiosResponse<Result<void, ApiError>>
  >(`${addressesUrl}/user/${userId}/default/${addressId}`);

  return res.data;
}

export async function resetDefaultAddressClient(
  userId: number,
): Promise<Result<void, ApiError>> {
  const res = await frontendHttp().post<
    unknown,
    AxiosResponse<Result<void, ApiError>>
  >(`${addressesUrl}/user/${userId}/default`);

  return res.data;
}
