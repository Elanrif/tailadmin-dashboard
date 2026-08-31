"use client";

import { useMemo, useState } from "react";
import { RoleFilter, StatusFilter } from "./filters";
import { UserFilters } from "@/lib/users/api/types";

type UseUserFiltersProps = {
  currentPage: number;
  itemsPerPage: number;
  onPageReset: () => void;
};

export function useUserFilters({
  currentPage,
  itemsPerPage,
  onPageReset,
}: UseUserFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filters = useMemo<UserFilters>(
    () => ({
      page: currentPage,
      size: itemsPerPage,
      search: searchQuery || undefined,
      role: roleFilter !== "All" ? roleFilter : undefined,
      status: statusFilter !== "All" ? statusFilter : undefined,
    }),
    [currentPage, itemsPerPage, searchQuery, roleFilter, statusFilter],
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onPageReset();
  };

  const handleRoleChange = (value: RoleFilter) => {
    setRoleFilter(value);
    onPageReset();
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatusFilter(value);
    onPageReset();
  };

  return {
    filters,
    searchQuery,
    roleFilter,
    statusFilter,
    handleSearch,
    handleRoleChange,
    handleStatusChange,
  };
}
