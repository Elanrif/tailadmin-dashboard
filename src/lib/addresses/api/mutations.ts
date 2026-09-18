import { mutationOptions } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { addressKeys } from "./queries";
import {
  AddressCreateFormValues,
  AddressUpdateFormValues,
} from "../schemas/address";
import {
  createUserAddress,
  updateAddress,
  deleteUserAddress,
  setDefaultAddress,
  resetDefaultAddress,
} from "./services/address.client";
import type { ApiError } from "@/lib/shared/api-error";
import { Address } from "./types";

export const createUserAddressMutation = mutationOptions<
  Address,
  ApiError,
  { payload: AddressCreateFormValues }
>({
  mutationFn: ({ payload }) => createUserAddress(payload),

  onSuccess: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});

export const updateAddressMutation = mutationOptions<
  Address,
  ApiError,
  {
    addressId: number;
    payload: AddressUpdateFormValues;
  }
>({
  mutationFn: ({ addressId, payload }) => updateAddress(addressId, payload),

  onSuccess: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});

export const setDefaultAddressMutation = mutationOptions<
  void,
  ApiError,
  {
    userId: number;
    addressId: number;
  }
>({
  mutationFn: ({ userId, addressId }) => setDefaultAddress(userId, addressId),

  onSuccess: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});

export const resetDefaultAddressMutation = mutationOptions<
  void,
  ApiError,
  number
>({
  mutationFn: (userId) => resetDefaultAddress(userId),

  onSuccess: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});

export const deleteUserAddressMutation = mutationOptions<
  void,
  ApiError,
  number
>({
  mutationFn: (id) => deleteUserAddress(id),

  onSuccess: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});
