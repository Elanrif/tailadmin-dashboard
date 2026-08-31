"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { userAddressesByIdOptions } from "../api/queries/queries.client";
import { Address } from "../api/types";
import AddressForm from "./ui/address-form";

type TAddressViewPageProps = {
  addressId: string;
  userId?: number;
  onSaved?: () => void;
};

export default function AddressFormView({
  addressId,
  userId,
  onSaved,
}: TAddressViewPageProps) {
  if (addressId === "new") {
    return (
      <AddressForm
        initialData={null}
        pageTitle="Create New Address"
        userId={userId}
        onSaved={onSaved}
      />
    );
  }

  return (
    <EditAddressView
      addressId={Number(addressId)}
      userId={userId}
      onSaved={onSaved}
    />
  );
}

function EditAddressView({
  addressId,
  onSaved,
  userId,
}: {
  addressId: number;
  userId?: number;
  onSaved?: () => void;
}) {
  const { data } = useSuspenseQuery(userAddressesByIdOptions(addressId));

  if (!data?.ok || !data?.data) {
    notFound();
  }
  return (
    <AddressForm
      initialData={data.data as Address}
      pageTitle="Edit Address"
      userId={userId}
      onSaved={onSaved}
    />
  );
}
