"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";
import {
  createUserAddressMutation,
  updateAddressMutation,
} from "@/lib/addresses/api/mutations";
import {
  addressCreateSchema,
  AddressCreateFormValues,
  AddressUpdateFormValues,
  addressUpdateSchema,
} from "@/lib/addresses/schemas/address";
import { Address } from "@/lib/addresses/api/types";
import { ChevronDownIcon, LoaderIcon, PenIcon } from "lucide-react";
import { AddressesQueryProps } from "../addresses";
import Select from "@/components/form/Select";
import { User } from "@/lib/users/api/types";
import { usersQueryOptions } from "@/lib/users/api/queries/queries.client";
import environment from "@/config/environment.config";

export default function AddressForm({
  initialData,
  pageTitle,
  hiddenFields: { userId } = {},
  onSaved,
}: {
  initialData: Address | null;
  pageTitle: string;
  hiddenFields?: AddressesQueryProps["queryParams"];
  onSaved?: () => void;
}) {
  const isEdit = !!initialData;

  const selectedAuthorId = initialData?.userId ?? userId;

  const showAuthorSelect = !isEdit && selectedAuthorId == null;

  const { data: usersResult } = useQuery({
    ...usersQueryOptions({ size: environment.pagination.size }),
    enabled: showAuthorSelect,
  });

  const users = usersResult?.content ?? [];

  const formSchema = isEdit ? addressUpdateSchema : addressCreateSchema;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressCreateFormValues | AddressUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          street: initialData.street,
          postalCode: initialData.postalCode,
          city: initialData.city,
          country: initialData.country,
          defaultAddress: initialData.defaultAddress ?? false,
        }
      : {
          street: "",
          postalCode: "",
          city: "",
          country: "",
          userId,
          defaultAddress: false,
        },
  });

  useEffect(() => {
    if (isEdit && initialData) {
      reset({
        street: initialData.street,
        postalCode: initialData.postalCode,
        city: initialData.city,
        country: initialData.country,
        defaultAddress: initialData.defaultAddress ?? false,
      });
    } else {
      reset({
        street: "",
        postalCode: "",
        city: "",
        country: "",
        userId,
        defaultAddress: false,
      });
    }
  }, [initialData, userId, isEdit, reset]);

  const createMutation = useMutation(createUserAddressMutation);
  const updateMutation = useMutation(updateAddressMutation);

  const onSubmit = (
    values: AddressCreateFormValues | AddressUpdateFormValues,
  ) => {
    if (isEdit && initialData) {
      updateMutation.mutate(
        {
          addressId: initialData.id,
          payload: values as AddressUpdateFormValues,
        },
        {
          onSuccess: () => {
            toast.success("Address updated successfully");
            onSaved?.();
          },
          onError: (error) => {
            if (error.status === 401) {
              toast.error("Votre session a expiré, veuillez vous reconnecter.");
              return;
            }
            toast.error(error.message);
          },
        },
      );

      return;
    }

    createMutation.mutate(
      {
        payload: values as AddressCreateFormValues,
      },
      {
        onSuccess: () => {
          toast.success("Address created successfully");
          onSaved?.();
        },
        onError: (error) => {
          if (error.status === 401) {
            toast.error("Votre session a expiré, veuillez vous reconnecter.");
            return;
          }
          toast.error(error.message);
        },
      },
    );
  };

  const handleDefaultAddressChange = (checked: boolean) => {
    setValue("defaultAddress", checked, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const isSaving =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:text-xl">
          {pageTitle}
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isEdit
            ? "Update the address details below."
            : "Create a new address for this user."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="street" required>
            Street
          </Label>

          <Input
            id="street"
            {...register("street")}
            placeholder="Enter street"
          />

          {errors.street && (
            <p className="mt-1 text-sm text-red-500">{errors.street.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="postalCode" required>
            Postal Code
          </Label>

          <Input
            id="postalCode"
            {...register("postalCode")}
            placeholder="Enter postal code"
          />

          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-500">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="city" required>
            City
          </Label>

          <Input id="city" {...register("city")} placeholder="Enter city" />

          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="country" required>
            Country
          </Label>

          <Input
            id="country"
            {...register("country")}
            placeholder="Enter country"
          />

          {errors.country && (
            <p className="mt-1 text-sm text-red-500">
              {errors.country.message}
            </p>
          )}
        </div>

        {/* Author : uniquement à la création, jamais à l'édition */}
        {!isEdit &&
          (showAuthorSelect ? (
            <div>
              <Label required>Author</Label>

              <div className="relative">
                <Select
                  options={users.map((user: User) => ({
                    value: String(user.id),
                    label: `${user.firstName} ${user.lastName} (${user.email})`,
                  }))}
                  placeholder="Select an author"
                  defaultValue={String(userId ?? "")}
                  onChange={(value) =>
                    setValue("userId", Number(value), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>

              {"userId" in errors && errors.userId && (
                <p className="text-sm text-error-500">
                  {errors.userId.message as string}
                </p>
              )}
            </div>
          ) : (
            <input type="hidden" {...register("userId")} />
          ))}
      </div>

      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <Switch
          label="Set as default address"
          defaultChecked={initialData?.defaultAddress ?? false}
          onChange={handleDefaultAddressChange}
        />
      </div>

      <div className="mt-5 flex justify-start">
        <Button
          type="submit"
          size="sm"
          variant="primary"
          startIcon={isEdit && <PenIcon size={16} />}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : isEdit ? "Edit" : "Create"}

          {isSaving && <LoaderIcon className="ml-2 animate-spin" />}
        </Button>
      </div>
    </form>
  );
}
