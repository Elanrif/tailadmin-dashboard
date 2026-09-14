import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import type { ApiError } from "@/lib/shared/api-error";
import type { Address } from "./types";

import {
  createUserAddressAction,
  deleteUserAddressAction,
  resetDefaultAddressAction,
  setDefaultAddressAction,
  updateAddressAction,
} from "./action";
import { addressKeys } from "./queries";
import { AddressCreateFormValues } from "../schemas/address";

export const createUserAddressMutation = mutationOptions<
  Address,
  ApiError,
  { payload: AddressCreateFormValues },
  unknown
>({
  mutationFn: async ({ payload }) => {
    const result = await createUserAddressAction(payload);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: addressKeys.all });
  },
});

export const updateAddressMutation = mutationOptions<
  Address,
  ApiError,
  { addressId: number; payload: Partial<AddressCreateFormValues> },
  unknown
>({
  mutationFn: async ({ addressId, payload }) => {
    const result = await updateAddressAction(addressId, payload);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: addressKeys.all });
  },
});

export const setDefaultAddressMutation = mutationOptions<
  void,
  ApiError,
  { userId: number; addressId: number },
  unknown
>({
  mutationFn: async ({ userId, addressId }) => {
    const result = await setDefaultAddressAction(userId, addressId);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: addressKeys.all });
  },
});

export const resetDefaultAddressMutation = mutationOptions<
  void,
  ApiError,
  number,
  unknown
>({
  mutationFn: async (userId) => {
    const result = await resetDefaultAddressAction(userId);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: addressKeys.all });
  },
});

export const deleteUserAddressMutation = mutationOptions<
  void,
  ApiError,
  number,
  unknown
>({
  mutationFn: async (id) => {
    const result = await deleteUserAddressAction(id);
    if (!result.ok) throw result.error;
    return result.data;
  },
  onSettled: () => {
    void getQueryClient().invalidateQueries({ queryKey: addressKeys.all });
  },
});
