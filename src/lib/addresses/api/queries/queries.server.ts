import { queryOptions } from "@tanstack/react-query";
import { addressKeys } from ".";
import {
  getUserAddress,
  getUserAddresses,
} from "../services/address.server";
import { AddressFilters } from "../types";

export const userAddressesQueryOptions = (
  filters: AddressFilters,
) =>
  queryOptions({
    queryKey: addressKeys.list(filters),
    queryFn: () => getUserAddresses(filters),
  });

export const userAddressesByIdOptions = (addressId: number) =>
  queryOptions({
    queryKey: addressKeys.byId(addressId),
    queryFn: () => getUserAddress(addressId),
  });
