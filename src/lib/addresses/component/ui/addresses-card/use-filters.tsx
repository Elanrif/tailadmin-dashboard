"use client";

import { useMemo, useState } from "react";
import { AddressFilters } from "@/lib/addresses/api/types";

type UseAddressFiltersProps = {
  userId?: number;
  currentPage: number;
  itemsPerPage: number;
  onPageReset: () => void;
};

export function useAddressFilters({
  userId,
  currentPage,
  itemsPerPage,
  onPageReset,
}: UseAddressFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");

  const filters = useMemo<AddressFilters>(
    () => ({
      current: currentPage,
      limit: itemsPerPage,
      userId,
      search: searchQuery || undefined,
      country: countryFilter !== "All" ? countryFilter : undefined,
      city: cityFilter !== "All" ? cityFilter : undefined,
    }),
    [currentPage, itemsPerPage, userId, searchQuery, countryFilter, cityFilter],
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onPageReset();
  };

  const handleCountryChange = (value: string) => {
    setCountryFilter(value);
    onPageReset();
  };

  const handleCityChange = (value: string) => {
    setCityFilter(value);
    onPageReset();
  };

  return {
    filters,
    searchQuery,
    countryFilter,
    cityFilter,
    handleSearch,
    handleCountryChange,
    handleCityChange,
  };
}
