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

export type RoleFilter = "All" | "ADMIN" | "USER";
export type StatusFilter = "All" | "Active" | "Inactive";
const LIMIT_OPTIONS = [5, 10, 20, 50];

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: RoleFilter;
  onRoleChange: (filter: RoleFilter) => void;
  statusFilter: StatusFilter;
  onStatusChange: (filter: StatusFilter) => void;
  itemsPerPage: number;
  onLimitChange: (size: string) => void;
}

export function Filters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  itemsPerPage,
  onLimitChange,
}: TableFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        {/* Limit Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h10M4 18h7"
                />
              </svg>
              Limit
              <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
                {itemsPerPage}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
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

        {/* Role Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Role{" "}
              {roleFilter !== "All" && (
                <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
                  {roleFilter}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {(["All", "ADMIN", "USER"] as RoleFilter[]).map((role) => (
              <DropdownMenuItem key={role} onClick={() => onRoleChange(role)}>
                <div className="flex items-center gap-2">
                  {roleFilter === role && (
                    <span className="text-brand-500">✓</span>
                  )}
                  {role}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Status{" "}
              {statusFilter !== "All" && (
                <span className="ml-1 rounded-full bg-brand-500 px-1.5 py-0.5 text-xs text-white">
                  {statusFilter}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {(["All", "Active", "Inactive"] as StatusFilter[]).map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => onStatusChange(status)}
              >
                <div className="flex items-center gap-2">
                  {statusFilter === status && (
                    <span className="text-brand-500">✓</span>
                  )}
                  {status}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
