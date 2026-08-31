"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UnifiedPagination } from "@/components/ui/paginations";
import { useModal } from "@/hooks/useModal";

import { exportToCSV } from "@/lib/utils";
import { Download } from "lucide-react";
import { Result } from "@/lib/shared/types";
import { ApiError } from "@/lib/shared/api-error";
import { usersQueryOptions } from "../api/queries/queries.client";
import { deleteUserMutation } from "../api/mutations";
import { userKeys } from "@/lib/auth/api/queries";
import { Filters } from "./ui/users-table/filters";
import { Columns } from "./ui/users-table/columns";
import { Row } from "./ui/users-table/row";
import { Modals } from "./ui/users-table/modals";
import { usePaginationParams } from "@/lib/use-pagination-params";
import { User } from "../api/types";
import { useUserFilters } from "./ui/users-table/use-filters";

export function Users() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { currentPage, itemsPerPage, handlePageChange, handleSizeChange } =
    usePaginationParams({
      pageParam: "page",
      sizeParam: "size",
      defaultPage: 1,
      defaultSize: 5,
    });

  const {
    filters,
    searchQuery,
    roleFilter,
    statusFilter,
    handleSearch,
    handleRoleChange,
    handleStatusChange,
  } = useUserFilters({
    currentPage,
    itemsPerPage,
    onPageReset: () => {
      handlePageChange(1);
    },
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data } = useSuspenseQuery(usersQueryOptions(filters));
  const { data: DownloadToCsv } = useSuspenseQuery(
    usersQueryOptions({ size: 1000 }),
  );
  const users = data.ok ? data?.data?.data || [] : [];
  const meta = data.ok ? data.data.meta : null;

  // Hooks de Modals uniques
  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  // Mutation
  const deleteMutation = useMutation({
    ...deleteUserMutation,
    onSuccess: async (result: Result<void, ApiError>) => {
      if (!result.ok) {
        toast.error(result.error?.message || "Failed to delete user");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User deleted successfully");
      setSelectedUser(null);
      deleteModal.closeModal();
      router.refresh();
    },
  });

  const handleView = (user: User) => {
    setSelectedUser(user);
    viewModal.openModal();
  };
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    editModal.openModal();
  };
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    deleteModal.openModal();
  };

  const exportUsers = () => {
    const users = DownloadToCsv.ok ? DownloadToCsv?.data?.data || [] : [];
    const dataToExport = users.map((user) => ({
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      telephone: user.phoneNumber || "-",
      role: user.role,
      status: user.status,
    }));
    const columnsConfig = [
      { key: "fullName", label: "Nom Complet" },
      { key: "email", label: "Email" },
      { key: "telephone", label: "Téléphone" },
      { key: "role", label: "Rôle" },
      { key: "status", label: "Statut" },
    ] as const;
    exportToCSV(dataToExport, columnsConfig, "liste-utilisateurs.csv");
  };

  const startIndex =
    meta && users.length > 0 ? (meta.page - 1) * meta.size + 1 : 0;
  const endIndex = meta ? startIndex + users.length - 1 : 0;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Users List
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your users and their roles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={exportUsers}>
            Export <Download size={16} />
          </Button>
          <Button
            onClick={() => createModal.openModal()}
            className="gap-2 bg-brand-500 hover:bg-brand-600 dark:text-white"
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Filtres déportés */}
      <Filters
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        roleFilter={roleFilter}
        onRoleChange={handleRoleChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        itemsPerPage={itemsPerPage}
        onLimitChange={handleSizeChange}
      />

      {/* Résumé textuel */}
      <div className="text-sm text-gray-500 dark:text-gray-400" id="table-top">
        Showing {startIndex} to {endIndex} of {meta?.total ?? 0} users
      </div>

      {/* Structure de la Table HTML */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="text-start bg-green-600 text-white border-b border-gray-100 dark:border-white/5">
              <Columns />
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {users.length > 0 ? (
                users.map((user) => (
                  <Row
                    key={user.id}
                    user={user}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Unifiée connectée au Serveur */}
      {meta && (
        <UnifiedPagination
          mode="server"
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={meta.size}
          onPageChange={handlePageChange}
          variant="both"
        />
      )}

      {/* Modals regroupées et isolées */}
      <Modals
        selectedUser={selectedUser}
        modals={{
          view: { isOpen: viewModal.isOpen, close: viewModal.closeModal },
          edit: { isOpen: editModal.isOpen, close: editModal.closeModal },
          create: { isOpen: createModal.isOpen, close: createModal.closeModal },
          delete: { isOpen: deleteModal.isOpen, close: deleteModal.closeModal },
        }}
        onConfirmDelete={() =>
          selectedUser && deleteMutation.mutate(selectedUser.id)
        }
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
