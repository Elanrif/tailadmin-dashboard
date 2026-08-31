"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useSession } from "@/lib/auth/components/auth.context";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddressUpdateFormValues,
  addressUpdateSchema,
} from "@/lib/addresses/schemas/address";
import { updateAddressMutation } from "@/lib/addresses/api/mutations";
import { toast } from "sonner";
import { addressKeys } from "@/lib/addresses/api/queries";
import ComponentCard from "../common/ComponentCard";
import { ChevronDownIcon } from "@/icons";
import Select from "../form/Select";
import useCountryCity from "@/hooks/use-contry-city";
import { userAddressesQueryOptions } from "@/lib/addresses/api/queries/queries.client";

export default function UserAddressCard() {
  const { user } = useSession();
  const queryClient = getQueryClient();
  const { data } = useSuspenseQuery(
    userAddressesQueryOptions({
      userId: user?.id as number,
      isDefault: true,
    }),
  );
  const { isOpen, openModal, closeModal } = useModal();
  const defaultAddress = data.ok ? data.data.data || [] : [];

  // Hook pays/villes
  const {
    selectedCountry,
    selectedCity,
    countryOptions,
    cityOptions,
    handleCountryChange,
    handleCityChange,
    isCountrySelected,
    hasCities,
  } = useCountryCity(
    defaultAddress[0]?.country || user?.addresses?.[0]?.country || "",
    defaultAddress[0]?.city || user?.addresses?.[0]?.city || "",
  );

  // États locaux pour le Select
  const [localCountry, setLocalCountry] = useState(selectedCountry);
  const [localCity, setLocalCity] = useState(selectedCity);

  // Synchronisation
  useEffect(() => {
    setTimeout(() => {
      setLocalCountry(selectedCountry);
    }, 0);
  }, [selectedCountry]);

  useEffect(() => {
    setTimeout(() => {
      setLocalCity(selectedCity);
    }, 0);
  }, [selectedCity]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressUpdateFormValues>({
    resolver: zodResolver(addressUpdateSchema),
    defaultValues: {
      street: defaultAddress[0]?.street || "",
      postalCode: defaultAddress[0]?.postalCode || "",
      city: defaultAddress[0]?.city || "",
      userId: user?.id || undefined,
      country: defaultAddress[0]?.country || "",
      defaultAddress: defaultAddress[0]?.defaultAddress ?? false,
    },
  });

  // Synchronisation avec React Hook Form
  useEffect(() => {
    if (selectedCountry) setValue("country", selectedCountry);
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (selectedCity) setValue("city", selectedCity);
  }, [selectedCity, setValue]);

  const updateMutation = useMutation({
    ...updateAddressMutation,
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to update address");
        return;
      }

      toast.success("Address updated successfully");

      await queryClient.invalidateQueries({
        queryKey: addressKeys.all,
      });

      closeModal();
    },

    onError: () => {
      toast.error("Failed to update address");
    },
  });

  const onSubmit = (values: AddressUpdateFormValues) => {
    updateMutation.mutate({
      addressId: defaultAddress[0]?.id as number,
      payload: values,
    });
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Default Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {(defaultAddress[0]?.country ||
                    user?.addresses?.[0]?.country) ??
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  City/State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {(defaultAddress[0]?.city || user?.addresses?.[0]?.city) ??
                    "N/A"}
                  ,{" "}
                  {(defaultAddress[0]?.country ||
                    user?.addresses?.[0]?.country) ??
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Postal Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {(defaultAddress[0]?.postalCode ||
                    user?.addresses?.[0]?.postalCode) ??
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  TAX ID
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  AS4568384
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Default Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {Object.keys(errors).length > 0 && (
              <ComponentCard>
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-700">
                      Impossible de soumettre le formulaire
                    </h4>
                    <p className="mt-1 text-sm text-red-600">
                      Certains champs contiennent des erreurs. Veuillez les
                      corriger avant de réessayer.
                    </p>
                  </div>
                </div>
              </ComponentCard>
            )}

            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                {/* Pays */}
                <div>
                  <Label required>Country</Label>
                  <div className="relative">
                    <Select
                      options={countryOptions}
                      defaultValue={localCountry}
                      onChange={(value: string) => {
                        setLocalCountry(value);
                        handleCountryChange(value);
                      }}
                      placeholder="Select a country"
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Ville */}
                <div>
                  <Label required>City/State</Label>
                  <div className="relative">
                    <Select
                      options={cityOptions}
                      defaultValue={localCity}
                      onChange={(value: string) => {
                        setLocalCity(value);
                        handleCityChange(value);
                      }}
                      placeholder={
                        !isCountrySelected
                          ? "Select a country first"
                          : "Select a city"
                      }
                      className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                  </div>
                  {!isCountrySelected && (
                    <p className="mt-1 text-sm text-yellow-500">
                      Please select a country first
                    </p>
                  )}
                  {isCountrySelected && !hasCities && (
                    <p className="mt-1 text-sm text-yellow-500">
                      No cities available for this country
                    </p>
                  )}
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                {/* Street */}
                <div>
                  <Label required>Street</Label>
                  <Input
                    {...register("street")}
                    type="text"
                    placeholder="Enter your street"
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                {/* Postal Code */}
                <div>
                  <Label required>Postal Code</Label>
                  <Input
                    {...register("postalCode")}
                    type="text"
                    placeholder="Enter postal code"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                {/* TAX ID */}
                <div>
                  <Label>TAX ID</Label>
                  <Input type="text" defaultValue="AS4568384" disabled />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting || !isCountrySelected || !selectedCity}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
