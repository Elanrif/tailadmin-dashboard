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
    queryFn: () => fetchUserAddresses(filters),
  });

export const userAddressesByIdQueryOptions = (addressId: number) =>
  queryOptions<Address, ApiError>({
    queryKey: addressKeys.byId(addressId),
    queryFn: () => fetchUserAddressById(addressId),
  });
