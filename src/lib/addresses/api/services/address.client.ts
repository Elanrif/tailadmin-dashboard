import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { Address, AddressesResponse, AddressFilters } from "../types";
import {
  AddressCreateFormValues,
  AddressUpdateFormValues,
} from "../../schemas/address";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const {
  api: {
    rest: {
      endpoints: { addresses: addressesUrl },
    },
  },
} = proxyEnvironment;

// --- Queries ---

export async function fetchUserAddresses(
  filters: AddressFilters = {},
): Promise<Result<AddressesResponse, ApiError>> {
  const { data } = await frontendHttp().get<
    Result<AddressesResponse, ApiError>
  >(addressesUrl, {
    params: filters,
  });

  return data;
}

export async function fetchUserAddressById(
  addressId: number,
): Promise<Result<Address, ApiError>> {
  const { data } = await frontendHttp().get<Result<Address, ApiError>>(
    `${addressesUrl}/${addressId}`,
  );

  return data;
}

// --- Mutations ---

export async function createUserAddress(
  payload: AddressCreateFormValues,
): Promise<Result<Address, ApiError>> {
  const { data } = await frontendHttp().post<Result<Address, ApiError>>(
    addressesUrl,
    payload,
  );

  return data;
}

export async function updateAddress(
  addressId: number,
  payload: AddressUpdateFormValues,
): Promise<Result<Address, ApiError>> {
  const { data } = await frontendHttp().patch<Result<Address, ApiError>>(
    `${addressesUrl}/${addressId}`,
    payload,
  );

  return data;
}

export async function deleteUserAddress(
  addressId: number,
): Promise<Result<void, ApiError>> {
  const { data } = await frontendHttp().delete<Result<void, ApiError>>(
    `${addressesUrl}/${addressId}`,
  );

  return data;
}

export async function setDefaultAddress(
  userId: number,
  addressId: number,
): Promise<Result<void, ApiError>> {
  const { data } = await frontendHttp().post<Result<void, ApiError>>(
    `${addressesUrl}/user/${userId}/default/${addressId}`,
  );

  return data;
}

export async function resetDefaultAddress(
  userId: number,
): Promise<Result<void, ApiError>> {
  const { data } = await frontendHttp().post<Result<void, ApiError>>(
    `${addressesUrl}/user/${userId}/default`,
  );

  return data;
}
