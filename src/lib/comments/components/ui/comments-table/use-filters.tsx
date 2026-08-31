"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CommentFilters } from "@/lib/comments/api/types";

type UseCommentFiltersProps = {
  currentPage: number;
  itemsPerPage: number;
  postID?: number;
  onPageReset: () => void;
};

export function useCommentFilters({
  currentPage,
  itemsPerPage,
  postID,
  onPageReset,
}: UseCommentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");

  const authorId = Number(searchParams.get("authorId")) || undefined;

  const postId = Number(searchParams.get("postId")) || postID || undefined;

  const filters = useMemo<CommentFilters>(
    () => ({
      page: currentPage,
      size: itemsPerPage,
      search: searchQuery || undefined,
      authorId,
      postId,
    }),
    [currentPage, itemsPerPage, searchQuery, authorId, postId],
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onPageReset();
  };

  const handleFilterChange = (key: "authorId" | "postId", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    filters,
    searchQuery,
    authorId,
    postId,
    handleSearch,
    handleFilterChange,
  };
}
