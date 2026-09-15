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
  mutationFn: async ({ payload }) => {
    const response = await createUserAddress(payload);
    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  },

  onSettled: () => {
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
  mutationFn: async ({ addressId, payload }) => {
    const response = await updateAddress(addressId, payload);
    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  },

  onSettled: () => {
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
  mutationFn: async ({ userId, addressId }) => {
    const response = await setDefaultAddress(userId, addressId);
    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  },

  onSettled: () => {
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
  mutationFn: async (userId) => {
    const response = await resetDefaultAddress(userId);
    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  },

  onSettled: () => {
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
  mutationFn: async (id) => {
    const response = await deleteUserAddress(id);
    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  },

  onSettled: () => {
    void getQueryClient().invalidateQueries({
      queryKey: addressKeys.all,
    });
  },
});
