"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Download } from "lucide-react";

import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UnifiedPagination } from "@/components/ui/paginations";
import { useModal } from "@/hooks/useModal";
import { ErrorState } from "@/lib/shared/ui/error-state";
import { EmptyState } from "@/lib/shared/ui/empty-state";

import { exportToCSV } from "@/lib/utils";
import { usersQueryOptions } from "../api/queries/queries.client";
import { deleteUserMutation } from "../api/mutations";
import { Filters } from "./ui/users-table/filters";
import { Columns } from "./ui/users-table/columns";
import { Row } from "./ui/users-table/row";
import { Modals } from "./ui/users-table/modals";
import { usePageQuery } from "@/lib/use-page-query";
import { User } from "../api/types";
import { useUserFilters } from "./ui/users-table/use-filters";
import environment from "@/config/environment.config";

const {
  pagination: { page, size },
  export: { maxSize: MAX_EXPORT_SIZE },
} = environment;

export function Users() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { currentPage, itemsPerPage, handlePageChange, handleSizeChange } =
    usePageQuery({
      pageParam: "page",
      sizeParam: "size",
      defaultPage: page,
      defaultSize: size,
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
    onPageReset: () => handlePageChange(1),
  });

  const { data } = useSuspenseQuery(usersQueryOptions(filters));

  const viewModal = useModal();
  const editModal = useModal();
  const createModal = useModal();
  const deleteModal = useModal();

  const openWith = (modal: ReturnType<typeof useModal>) => (item: User) => {
    setSelectedUser(item);
    modal.openModal();
  };

  const deleteMutation = useMutation(deleteUserMutation);
  const handleDelete = async () => {
    if (!selectedUser) return;
    const result = await deleteMutation.mutateAsync(selectedUser.id);
    if (!result.ok) {
      toast.error(result.error.message);
      return;
    }
    toast.success("User deleted successfully");
    deleteModal.closeModal();
    setSelectedUser(null);
  };

  const exportUsers = async () => {
    const result = await queryClient.fetchQuery(
      usersQueryOptions({ size: MAX_EXPORT_SIZE }),
    );
    const rows = result.ok ? result.data.content : [];

    const dataToExport = rows.map((user) => ({
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

    exportToCSV(dataToExport, columnsConfig, "users.csv");
  };

  if (!data.ok) {
    return <ErrorState error={data.error} />;
  }

  const users = data.data.content;
  const pagination = data.data;

  const startIndex =
    users.length > 0 ? (pagination.page - 1) * pagination.size + 1 : 0;
  const endIndex = users.length > 0 ? startIndex + users.length - 1 : 0;

  return (
    <div className="space-y-4">
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

      <div className="text-sm text-gray-500 dark:text-gray-400" id="table-top">
        Showing {startIndex} to {endIndex} of {pagination.total} users
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          {users.length > 0 ? (
            <Table>
              <TableHeader className="text-start bg-brand-500 text-white border-b border-gray-100 dark:border-white/5">
                <Columns />
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                {users.map((user) => (
                  <Row
                    key={user.id}
                    user={user}
                    onView={openWith(viewModal)}
                    onEdit={openWith(editModal)}
                    onDelete={openWith(deleteModal)}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="Aucun utilisateur"
              description="Aucun utilisateur ne correspond à ces critères pour le moment."
              fullWidth={false}
              className="border-0 bg-transparent"
            />
          )}
        </div>
      </div>

      <UnifiedPagination
        mode="server"
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        itemsPerPage={pagination.size}
        onPageChange={handlePageChange}
        variant="both"
      />

      <Modals
        selectedUser={selectedUser}
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
