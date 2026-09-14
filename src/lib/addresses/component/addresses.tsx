"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UnifiedPagination } from "@/components/ui/paginations";
import { useModal } from "@/hooks/useModal";
import { exportToCSV } from "@/lib/utils";
import { Address } from "@/lib/addresses/api/types";
import { userAddressesQueryOptions } from "@/lib/addresses/api/queries/queries.client";
import { deleteUserAddressMutation } from "@/lib/addresses/api/mutations";
import { usePageQuery } from "@/lib/use-page-query";
import { Filters } from "./ui/addresses-card/filters";
import { Row } from "./ui/addresses-card/row";
import { Modals } from "./ui/addresses-card/modals";
import { useAddressFilters } from "./ui/addresses-card/use-filters";
import environment from "@/config/environment.config";
import { ErrorState } from "@/lib/shared/ui/error-state";
import { EmptyState } from "@/lib/shared/ui/empty-state";
import { handleApiError } from "@/lib/shared/handle-api-error";
import { useRouter } from "next/navigation";

export type AddressesQueryProps = {
  queryParams?: {
    userId?: number;
  };
};

const {
  pagination: { page, size },
} = environment;

export function Addresses({ queryParams }: AddressesQueryProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const { currentPage, itemsPerPage, handlePageChange, handleSizeChange } =
    usePageQuery({
      pageParam: "current",
      sizeParam: "limit",
      defaultPage: page,
      defaultSize: size,
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

  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const openWith = (modal: ReturnType<typeof useModal>) => (item: Address) => {
    setSelectedAddress(item);
    modal.openModal();
  };

  const deleteMutation = useMutation(deleteUserAddressMutation);
  const handleDelete = () => {
    if (!selectedAddress) return;
    deleteMutation.mutate(selectedAddress.id, {
      onSuccess: () => {
        toast.success("Address deleted successfully");
        deleteModal.closeModal();
        setSelectedAddress(null);
      },
      onError: (error) => {
        handleApiError(error, router);
      },
    });
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

      const list = result.data.content || [];

      const dataToExport = list.map((address: Address) => ({
        street: address.street,
        postalCode: address.postalCode,
        city: address.city,
        country: address.country,
      }));

      const columnsConfig = [
        { key: "street", label: "Rue" },
        { key: "postalCode", label: "Code Postal" },
        { key: "city", label: "Ville" },
        { key: "country", label: "Pays" },
      ] as const;

      exportToCSV(dataToExport, columnsConfig, "liste-adresses.csv");
    } catch {
      toast.error("Failed to export addresses");
    }
  };

  if (!data.ok) {
    return <ErrorState error={data.error} />;
  }

  const addresses = data.data.content;
  const pagination = data.data;

  const startIndex =
    pagination && addresses.length > 0
      ? (pagination.page - 1) * pagination.size + 1
      : 0;

  const endIndex =
    pagination && addresses.length > 0 ? startIndex + addresses.length - 1 : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Addresses List
        </h2>

        <div className="flex items-center gap-3">
          <Button onClick={handleExportCSV}>
            Export <Download size={16} />
          </Button>
          <Button
            onClick={() => createModal.openModal()}
            className="gap-2 bg-brand-500 hover:bg-brand-600 dark:text-white"
          >
            Add Address
          </Button>
        </div>
      </div>

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

      <div id="address-table-top">
        Showing {startIndex} to {endIndex} of {pagination?.total ?? 0}
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 p-3">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <Row
                key={address.id}
                address={address}
                onView={openWith(viewModal)}
                onEdit={openWith(editModal)}
                onDelete={openWith(deleteModal)}
              />
            ))
          ) : (
            <EmptyState
              title="Aucune adresse"
              description="Aucune adresse ne correspond à ces critères pour le moment."
              action={{
                label: "Ajouter",
                onClick: () => createModal.openModal(),
              }}
            />
          )}
        </div>
      </div>

      {pagination && (
        <UnifiedPagination
          mode="server"
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.size}
          onPageChange={handlePageChange}
          variant="both"
          updateUrl={false}
        />
      )}

      <Modals
        selectedAddress={selectedAddress}
        hiddenFields={{
          userId: queryParams?.userId,
        }}
        modals={{
          view: { isOpen: viewModal.isOpen, close: viewModal.closeModal },
          edit: { isOpen: editModal.isOpen, close: editModal.closeModal },
          create: { isOpen: createModal.isOpen, close: createModal.closeModal },
          delete: { isOpen: deleteModal.isOpen, close: deleteModal.closeModal },
        }}
        onConfirmDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
