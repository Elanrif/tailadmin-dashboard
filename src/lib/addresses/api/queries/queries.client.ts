import { queryOptions } from "@tanstack/react-query";

import { addressKeys } from ".";
import {
  fetchUserAddressById,
  fetchUserAddresses,
} from "../services/address.client";
import { Address, AddressesResponse, AddressFilters } from "../types";
import { ApiError } from "@/lib/shared/api-error";

export const userAddressesQueryOptions = (filters: AddressFilters) =>
  queryOptions<AddressesResponse, ApiError>({
    queryKey: addressKeys.list(filters),
    queryFn: async () => {
      const response = await fetchUserAddresses(filters);
      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });

export const userAddressesByIdQueryOptions = (addressId: number) =>
  queryOptions<Address, ApiError>({
    queryKey: addressKeys.byId(addressId),
    queryFn: async () => {
      const response = await fetchUserAddressById(addressId);

      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });
