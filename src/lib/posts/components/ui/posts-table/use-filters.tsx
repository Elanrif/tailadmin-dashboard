"use client";

import { PostFilters } from "@/lib/posts/api/types";
import { useMemo, useState } from "react";

type UsePostFiltersProps = {
  currentPage: number;
  itemsPerPage: number;
  onPageReset: () => void;
};

export function usePostFilters({
  currentPage,
  itemsPerPage,
  onPageReset,
}: UsePostFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filters = useMemo<PostFilters>(
    () => ({
      page: currentPage,
      size: itemsPerPage,
      search: searchQuery || undefined,
    }),
    [currentPage, itemsPerPage, searchQuery],
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onPageReset();
  };

  return {
    filters,
    searchQuery,
    handleSearch,
  };
}
