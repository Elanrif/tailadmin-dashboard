"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { PostFilters } from "@/lib/posts/api/types";

type UsePostFiltersProps = {
  authorId?: number;
  currentPage: number;
  itemsPerPage: number;
  onPageReset: () => void;
};

export function usePostFilters({
  authorId,
  currentPage,
  itemsPerPage,
  onPageReset,
}: UsePostFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");

  const selectedAuthorId =
    Number(searchParams.get("authorId")) || authorId || undefined;

  const filters = useMemo<PostFilters>(
    () => ({
      page: currentPage,
      size: itemsPerPage,
      authorId: selectedAuthorId,
      search: searchQuery || undefined,
    }),
    [currentPage, itemsPerPage, selectedAuthorId, searchQuery],
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onPageReset();
  };

  const handleAuthorChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (value) {
      params.set("authorId", value);
    } else {
      params.delete("authorId");
    }

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return {
    filters,
    searchQuery,
    authorId: selectedAuthorId,
    handleSearch,
    handleAuthorChange,
  };
}
