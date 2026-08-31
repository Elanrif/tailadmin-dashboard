"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";

import Button from "@/components/ui/button/Button";
import { UnifiedPagination } from "@/components/ui/paginations";
import { useModal } from "@/hooks/useModal";
import { exportToCSV } from "@/lib/utils";
import { Address } from "@/lib/addresses/api/types";
import { userAddressesQueryOptions } from "@/lib/addresses/api/queries/queries.client";
import { deleteUserAddressMutation } from "@/lib/addresses/api/mutations";
import { addressKeys } from "@/lib/addresses/api/queries";
import { usePaginationParams } from "@/lib/use-pagination-params";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";
import { Filters } from "./ui/addresses-card/filters";
import { Row } from "./ui/addresses-card/row";
import { NoResult } from "./ui/addresses-card/no-result";
import { Modals } from "./ui/addresses-card/modals";
import { useAddressFilters } from "./ui/addresses-card/use-filters";

export type AddressesQueryProps = {
  // Optional parameters provided by the parent to scope the addresses.
  queryParams?: {
    userId?: number;
  };
};

export function Addresses({ queryParams }: AddressesQueryProps) {
  const queryClient = useQueryClient();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const { currentPage, itemsPerPage, handlePageChange, handleSizeChange } =
    usePaginationParams({
      pageParam: "current",
      sizeParam: "limit",
      defaultPage: 1,
      defaultSize: 5,
    });

  const {
    filters,
    searchQuery,
    countryFilter,
    cityFilter,
    handleSearch,
    handleCountryChange,
    handleCityChange,
  } = useAddressFilters({
    userId: queryParams?.userId,
    currentPage,
    itemsPerPage,
    onPageReset: () => handlePageChange(1),
  });

  const { data } = useSuspenseQuery(userAddressesQueryOptions(filters));

  const addresses = data.ok ? data.data.data || [] : [];

  const meta = data.ok ? data.data.meta : null;

  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const deleteMutation = useMutation({
    ...deleteUserAddressMutation,

    onSuccess: async (result: Result<void, ApiError>) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to delete address");
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: addressKeys.all,
      });

      toast.success("Address deleted successfully");

      setSelectedAddress(null);
      deleteModal.closeModal();
    },
  });

  const handleView = (address: Address) => {
    setSelectedAddress(address);
    viewModal.openModal();
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    editModal.openModal();
  };

  const handleDelete = (address: Address) => {
    setSelectedAddress(address);
    deleteModal.openModal();
  };

  const handleExportCSV = async () => {
    try {
      const result = await queryClient.fetchQuery(
        userAddressesQueryOptions({
          userId: queryParams?.userId,
          current: 1,
          limit: 1000,
        }),
      );

      if (!result.ok) {
        toast.error("Failed to export addresses");
        return;
      }

      const list = result.data.data || [];

      const dataToExport = list.map((address: Address) => ({
        street: address.street,
        postalCode: address.postalCode,
        city: address.city,
        country: address.country,
      }));

      const columnsConfig = [
        {
          key: "street",
          label: "Rue",
        },
        {
          key: "postalCode",
          label: "Code Postal",
        },
        {
          key: "city",
          label: "Ville",
        },
        {
          key: "country",
          label: "Pays",
        },
      ] as const;

      exportToCSV(dataToExport, columnsConfig, "liste-adresses.csv");
    } catch {
      toast.error("Failed to export addresses");
    }
  };

  const startIndex =
    meta && addresses.length > 0 ? (meta.page - 1) * meta.size + 1 : 0;

  const endIndex =
    meta && addresses.length > 0 ? startIndex + addresses.length - 1 : 0;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Addresses List
        </h2>

        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            className="gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 dark:bg-green-900 dark:hover:bg-green-700 dark:text-white"
          >
            Export
            <Download size={16} />
          </Button>

          <Button
            onClick={() => createModal.openModal()}
            className="gap-2 bg-brand-500 hover:bg-brand-600 dark:text-white"
          >
            Add Address
          </Button>
        </div>
      </div>
      {/* FILTERS */}
      <Filters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        itemsPerPage={itemsPerPage}
        onLimitChange={handleSizeChange}
        countryFilter={countryFilter}
        onCountryChange={handleCountryChange}
        cityFilter={cityFilter}
        onCityChange={handleCityChange}
      />
      {/* INFO */}
      <div id="address-table-top">
        Showing {startIndex} to {endIndex} of {meta?.total ?? 0}
      </div>
      {/* GRID CARDS */}
      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 p-3">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <Row
                key={address.id}
                address={address}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <NoResult onAdd={() => createModal.openModal()} />
          )}
        </div>
      </div>
      {/* PAGINATION */}
      {meta && (
        <UnifiedPagination
          mode="server"
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={meta.size}
          onPageChange={handlePageChange}
          variant="both"
          updateUrl={false}
        />
      )}
      {/* MODALS */}
      <Modals
        selectedAddress={selectedAddress}
        hiddenFields={{
          userId: queryParams?.userId,
        }}
        modals={{
          view: {
            isOpen: viewModal.isOpen,
            close: viewModal.closeModal,
          },

          edit: {
            isOpen: editModal.isOpen,
            close: editModal.closeModal,
          },

          create: {
            isOpen: createModal.isOpen,
            close: createModal.closeModal,
          },

          delete: {
            isOpen: deleteModal.isOpen,
            close: deleteModal.closeModal,
          },
        }}
        onConfirmDelete={() =>
          selectedAddress &&
          deleteMutation.mutate({
            addressId: selectedAddress.id,
          })
        }
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
