import { Building2, Globe, Hash, MapPin, MapPinned } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import notFound from "@/app/not-found";
import { userAddressesByIdOptions } from "../api/queries/queries.client";

export default function AddressDetails({ addressId }: { addressId: number }) {
  const { data } = useSuspenseQuery(userAddressesByIdOptions(addressId));
  if (!data.ok) {
    notFound();
    return null;
  }
  const address = data.data;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white lg:text-xl">
          Address Details
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Informations détaillées de l&apos;adresse.
        </p>
      </div>

      {/* Address card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Street */}
        <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Rue
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {address.street || "—"}
            </p>
          </div>

          <MapPin className="hidden h-5 w-5 text-gray-300 sm:block dark:text-gray-600" />
        </div>

        {/* City */}
        <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Ville
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {address.city || "—"}
            </p>
          </div>

          <Building2 className="hidden h-5 w-5 text-gray-300 sm:block dark:text-gray-600" />
        </div>

        {/* Postal code */}
        <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Code postal
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {address.postalCode || "—"}
            </p>
          </div>

          <Hash className="hidden h-5 w-5 text-gray-300 sm:block dark:text-gray-600" />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Pays
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {address.country || "—"}
            </p>
          </div>

          <Globe className="hidden h-5 w-5 text-gray-300 sm:block dark:text-gray-600" />
        </div>

        {/* Address ID */}
        <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Identifiant
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
              {address.id}
            </p>
          </div>

          <MapPinned className="hidden h-5 w-5 text-gray-300 sm:block dark:text-gray-600" />
        </div>
      </div>
    </div>
  );
}
