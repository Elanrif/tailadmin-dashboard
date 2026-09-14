import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

import {
  createUserAddressAction,
  deleteUserAddressAction,
  resetDefaultAddressAction,
  setDefaultAddressAction,
  updateAddressAction,
} from "./action";
import { addressKeys } from "./queries";
import { AddressCreateFormValues } from "../schemas/address";

export const createUserAddressMutation = mutationOptions({
  mutationFn: ({ payload }: { payload: AddressCreateFormValues }) =>
    createUserAddressAction(payload),

  onSettled: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});

export const updateAddressMutation = mutationOptions({
  mutationFn: ({
    addressId,
    payload,
  }: {
    addressId: number;
    payload: Partial<AddressCreateFormValues>;
  }) => updateAddressAction(addressId, payload),

  onSettled: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});

export const setDefaultAddressMutation = mutationOptions({
  mutationFn: ({ userId, addressId }: { userId: number; addressId: number }) =>
    setDefaultAddressAction(userId, addressId),

  onSettled: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});

export const resetDefaultAddressMutation = mutationOptions({
  mutationFn: (userId: number) => resetDefaultAddressAction(userId),

  onSettled: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});

export const deleteUserAddressMutation = mutationOptions({
  mutationFn: (id: number) => deleteUserAddressAction(id),

  onSettled: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});
