import { queryOptions } from "@tanstack/react-query";
import { addressKeys } from ".";
import {
  fetchUserAddressById,
  fetchUserAddresses,
} from "../services/address.client";
import { AddressFilters } from "../types";

export const userAddressesQueryOptions = (filters: AddressFilters) =>
  queryOptions({
    queryKey: addressKeys.list(filters),
    queryFn: () => fetchUserAddresses(filters),
  });

export const userAddressesByIdOptions = (addressId: number) =>
  queryOptions({
    queryKey: addressKeys.byId(addressId),
    queryFn: () => fetchUserAddressById(addressId),
  });
