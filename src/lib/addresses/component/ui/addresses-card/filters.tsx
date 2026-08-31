"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LIMIT_OPTIONS = [5, 10, 20, 50];

export type CountryFilter = "All" | string;
export type CityFilter = "All" | string;

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;

  countryFilter: CountryFilter;
  onCountryChange: (filter: CountryFilter) => void;

  cityFilter: CityFilter;
  onCityChange: (filter: CityFilter) => void;

  itemsPerPage: number;
  onLimitChange: (limit: string) => void;
}

export function Filters({
  searchQuery,
  onSearchChange,
  countryFilter,
  onCountryChange,
  cityFilter,
  onCityChange,
  itemsPerPage,
  onLimitChange,
}: TableFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* SEARCH */}
      <div className="relative w-full sm:max-w-xs">
        <Input
          type="text"
          placeholder="Search address..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-3"
        />
      </div>

      <div className="flex gap-2">
        {/* LIMIT */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Limit ({itemsPerPage})</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={String(itemsPerPage)}
              onValueChange={onLimitChange}
            >
              {LIMIT_OPTIONS.map((limit) => (
                <DropdownMenuRadioItem key={limit} value={String(limit)}>
                  {limit}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* COUNTRY */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Country {countryFilter !== "All" ? `(${countryFilter})` : ""}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onCountryChange("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCountryChange("Morocco")}>
              Morocco
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCountryChange("France")}>
              France
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCountryChange("USA")}>
              USA
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* CITY */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              City {cityFilter !== "All" ? `(${cityFilter})` : ""}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onCityChange("All")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCityChange("Tétouan")}>
              Tétouan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCityChange("Casablanca")}>
              Casablanca
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCityChange("Paris")}>
              Paris
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
