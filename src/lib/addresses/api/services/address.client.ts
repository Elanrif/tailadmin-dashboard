import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { Address, AddressesResponse, AddressFilters } from "../types";
import {
  AddressCreateFormValues,
  AddressUpdateFormValues,
} from "../../schemas/address";
import { unwrapApiError } from "@/lib/shared/handle-api-error";

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
): Promise<AddressesResponse> {
  try {
    const { data } = await frontendHttp().get<AddressesResponse>(addressesUrl, {
      params: filters,
    });
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function fetchUserAddressById(
  addressId: number,
): Promise<Address> {
  try {
    const { data } = await frontendHttp().get<Address>(
      `${addressesUrl}/${addressId}`,
    );
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

// --- Mutations ---

export async function createUserAddress(
  payload: AddressCreateFormValues,
): Promise<Address> {
  try {
    const { data } = await frontendHttp().post<Address>(addressesUrl, payload);
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function updateAddress(
  addressId: number,
  payload: AddressUpdateFormValues,
): Promise<Address> {
  try {
    const { data } = await frontendHttp().patch<Address>(
      `${addressesUrl}/${addressId}`,
      payload,
    );
    return data;
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function deleteUserAddress(addressId: number): Promise<void> {
  try {
    await frontendHttp().delete(`${addressesUrl}/${addressId}`);
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function setDefaultAddress(
  userId: number,
  addressId: number,
): Promise<void> {
  try {
    await frontendHttp().post(
      `${addressesUrl}/user/${userId}/default/${addressId}`,
    );
  } catch (error) {
    throw unwrapApiError(error);
  }
}

export async function resetDefaultAddress(userId: number): Promise<void> {
  try {
    await frontendHttp().post(`${addressesUrl}/user/${userId}/default`);
  } catch (error) {
    throw unwrapApiError(error);
  }
}
