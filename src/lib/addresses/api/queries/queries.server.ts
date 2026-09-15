"use server";

import { queryOptions } from "@tanstack/react-query";
import { addressKeys } from ".";
import { getUserAddress, getUserAddresses } from "../services/address.server";
import { Address, AddressesResponse, AddressFilters } from "../types";
import { ApiError } from "@/lib/shared/api-error";

export const userAddressesQueryOptions = (filters: AddressFilters) =>
  queryOptions<AddressesResponse, ApiError>({
    queryKey: addressKeys.list(filters),
    queryFn: async () => {
      const response = await getUserAddresses(filters);

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
      const response = await getUserAddress(addressId);

      if (!response.ok) {
        throw response.error;
      }

      return response.data;
    },
  });
