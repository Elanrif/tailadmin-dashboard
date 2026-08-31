"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input";
import Label from "@/components/form/Label";
import Switch from "@/components/form/switch/Switch";
import {
  createUserAddressMutation,
  updateAddressMutation,
} from "@/lib/addresses/api/mutations";
import { addressKeys } from "@/lib/addresses/api/queries";
import {
  addressCreateSchema,
  AddressFormValues,
  AddressUpdateFormValues,
  addressUpdateSchema,
} from "@/lib/addresses/schemas/address";
import { Address } from "@/lib/addresses/api/types";
import { LoaderIcon, PenIcon, PlusIcon } from "lucide-react";

export default function AddressForm({
  initialData,
  pageTitle,
  userId,
  onSaved,
}: {
  initialData: Address | null;
  pageTitle: string;
  userId?: number;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!initialData;
  const formSchema = isEdit ? addressUpdateSchema : addressCreateSchema;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues | AddressUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: initialData?.street ?? "",
      postalCode: initialData?.postalCode ?? "",
      city: initialData?.city ?? "",
      country: initialData?.country ?? "",
      userId,
      defaultAddress: initialData?.defaultAddress ?? false,
    },
  });

  useEffect(() => {
    reset({
      street: initialData?.street ?? "",
      postalCode: initialData?.postalCode ?? "",
      city: initialData?.city ?? "",
      country: initialData?.country ?? "",
      userId,
      defaultAddress: initialData?.defaultAddress ?? false,
    });
  }, [initialData, userId, reset]);

  const createMutation = useMutation({
    ...createUserAddressMutation,
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to create address");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("Address created successfully");
      onSaved?.();
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to create address");
    },
  });

  const updateMutation = useMutation({
    ...updateAddressMutation,
    onSuccess: async (result) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to update address");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("Address updated successfully");
      onSaved?.();
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update address");
    },
  });

  const onSubmit = (values: AddressFormValues | AddressUpdateFormValues) => {
    if (isEdit && initialData) {
      const parsed = addressUpdateSchema.safeParse(values);
      if (parsed.success) {
        updateMutation.mutate({
          addressId: initialData.id,
          payload: parsed.data,
        });
      }
      return;
    }

    const parsed = addressCreateSchema.safeParse(values);
    if (!parsed.success) {
      return;
    }

    if (!userId) {
      toast.error("User is required to create an address");
      return;
    }

    createMutation.mutate({
      payload: parsed.data,
    });
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
      </div>
      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <Switch
          label="Set as default address"
          defaultChecked={initialData?.defaultAddress ?? false}
          onChange={handleDefaultAddressChange}
        />
      </div>

      {/* =================================================
                SUBMIT
                ================================================= */}
      <div className="mt-5 flex justify-start">
        <Button
          type="submit"
          size="sm"
          variant="primary"
          startIcon={isEdit ? <PenIcon size={16} /> : <PlusIcon size={16} />}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : isEdit ? "Edit" : "Create"}

          {isSaving && <LoaderIcon className="ml-2 animate-spin" />}
        </Button>
      </div>
    </form>
  );
}
