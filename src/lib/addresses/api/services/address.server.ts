"use server";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@config/logger.config";
import { validateId } from "@/utils";
import { Address, AddressesResponse, AddressFilters } from "../types";
import {
  AddressCreatePayload,
  AddressUpdatePayload,
  addressCreateSchema,
  addressUpdateSchema,
} from "../../schemas/address";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";

const logger = getLogger("server");

const {
  api: {
    rest: {
      endpoints: { addresses: addressesUrl },
    },
  },
} = environment;

export async function getUserAddresses(
  filters: AddressFilters = {},
): Promise<Result<AddressesResponse, ApiError>> {
  try {
    const params = new URLSearchParams();
    const { current, limit, ...rest } = filters;

    if (current != null) params.set("page", String(current));
    if (limit != null) params.set("size", String(limit));

    Object.entries(rest).forEach(([key, value]) => {
      if (value != null && value !== "") {
        params.set(key, String(value));
      }
    });

    const url = params.toString()
      ? `${addressesUrl}?${params.toString()}`
      : addressesUrl;

    const response = await apiClient().get<AddressesResponse>(url);

    logger.info(
      {
        url,
        filters,
        count: response.data.meta.total,
      },
      "User addresses fetched",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getUserAddresses"),
    };
  }
}

export async function getDefaultUserAddress(
  userId: number,
): Promise<Result<Address, ApiError>> {
  const idError = validateId(userId);

  if (idError) return idError;

  try {
    const response = await apiClient().get<Address>(
      `${addressesUrl}/user/${userId}/default`,
    );

    logger.info(
      {
        userId,
        addressId: response.data.id,
      },
      "Default address fetched",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getDefaultUserAddress"),
    };
  }
}

export async function getUserAddress(
  addressId: number,
): Promise<Result<Address, ApiError>> {
  const idError = validateId(addressId);

  if (idError) return idError;

  try {
    const response = await apiClient().get<Address>(
      `${addressesUrl}/${addressId}`,
    );

    logger.info(
      {
        addressId,
      },
      "Address fetched",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "getUserAddress"),
    };
  }
}

export async function createUserAddress(
  payload: AddressCreatePayload,
): Promise<Result<Address, ApiError>> {
  const parse = addressCreateSchema.safeParse(payload);

  // Zod error: the validation error is already known locally,
  // so we directly return it as an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        errors: parse.error.format(),
      },
      "Address creation validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    const response = await apiClient().post<Address>(
      addressesUrl,
      parse.data,
    );

    logger.info(
      {
        addressId: response.data.id,
      },
      "Address created",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "createUserAddress"),
    };
  }
}

export async function updateAddress(
  addressId: number,
  payload: AddressUpdatePayload,
): Promise<Result<Address, ApiError>> {
  const idError = validateId(addressId);

  if (idError) return idError;

  const parse = addressUpdateSchema.safeParse(payload);

  // Zod error: the validation error is already known locally,
  // so we directly return it as an ApiError with HTTP 400.
  if (!parse.success) {
    logger.warn(
      {
        errors: parse.error.format(),
      },
      "Address update validation failed",
    );

    const error: ApiError = {
      status: 400,
      error: "Bad Request",
      message: parse.error.message,
    };

    return {
      ok: false,
      error,
    };
  }

  try {
    const response = await apiClient().patch<Address>(
      `${addressesUrl}/${addressId}`,
      parse.data,
    );

    logger.info(
      {
        addressId,
      },
      "Address updated",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "updateAddress"),
    };
  }
}

export async function deleteUserAddress(
  addressId: number,
): Promise<Result<void, ApiError>> {
  const addressError = validateId(addressId);

  if (addressError) return addressError;

  try {
    await apiClient().delete(`${addressesUrl}/${addressId}`);

    logger.info(
      {
        addressId,
      },
      "Address deleted",
    );

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "deleteUserAddress"),
    };
  }
}

export async function setDefaultAddress(
  userId: number,
  addressId: number,
): Promise<Result<void, ApiError>> {
  const userError = validateId(userId);

  if (userError) return userError;

  const addressError = validateId(addressId);

  if (addressError) return addressError;

  try {
    await apiClient().post(
      `${addressesUrl}/user/${userId}/default/${addressId}`,
    );

    logger.info(
      {
        userId,
        addressId,
      },
      "Default address updated",
    );

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "setDefaultAddress"),
    };
  }
}

export async function resetDefaultAddress(
  userId: number,
): Promise<Result<void, ApiError>> {
  const idError = validateId(userId);

  if (idError) return idError;

  try {
    await apiClient().post(
      `${addressesUrl}/user/${userId}/default`,
    );

    logger.info(
      {
        userId,
      },
      "Default address reset",
    );

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    // Backend/Axios error: ApiError normalizes the Spring Boot error response.
    return {
      ok: false,
      error: ApiError(error, "resetDefaultAddress"),
    };
  }
}
