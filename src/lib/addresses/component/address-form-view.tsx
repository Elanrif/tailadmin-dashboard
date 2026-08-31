"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { userAddressesByIdOptions } from "../api/queries/queries.client";
import { Address } from "../api/types";
import AddressForm from "./ui/address-form";
import { AddressesQueryProps } from "./addresses";

type TAddressViewPageProps = {
  addressId: string;
  onSaved?: () => void;
  hiddenFields: AddressesQueryProps["queryParams"];
};

export default function AddressFormView({
  addressId,
  hiddenFields: { userId } = {},
  onSaved,
}: TAddressViewPageProps) {
  if (addressId === "new") {
    return (
      <AddressForm
        initialData={null}
        pageTitle="Create New Address"
        hiddenFields={{ userId }}
        onSaved={onSaved}
      />
    );
  }

  return (
    <EditAddressView
      addressId={Number(addressId)}
      hiddenFields={{ userId }}
      onSaved={onSaved}
    />
  );
}

function EditAddressView({
  addressId,
  onSaved,
  hiddenFields: { userId } = {},
}: {
  addressId: number;
  onSaved?: () => void;
  hiddenFields: AddressesQueryProps["queryParams"];
}) {
  const { data } = useSuspenseQuery(userAddressesByIdOptions(addressId));

  if (!data?.ok || !data?.data) {
    notFound();
  }
  return (
    <AddressForm
      initialData={data.data as Address}
      pageTitle="Edit Address"
      hiddenFields={{ userId }}
      onSaved={onSaved}
    />
  );
}
