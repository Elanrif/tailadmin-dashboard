"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UsePaginationParamsOptions = {
  defaultPage?: number;
  defaultSize?: number;
  pageParam?: string;
  sizeParam?: string;
};

export function usePaginationParams({
  defaultPage = 1,
  defaultSize = 5,
  pageParam = "page",
  sizeParam: sizeParam = "size",
}: UsePaginationParamsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get(pageParam)) || defaultPage;

  const itemsPerPage = Number(searchParams.get(sizeParam)) || defaultSize;

  const updateParams = (page: number, size: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(pageParam, String(page));
    params.set(sizeParam, String(size));

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const handlePageChange = (page: number) => {
    updateParams(page, itemsPerPage);
  };

  const handleSizeChange = (size: string) => {
    updateParams(1, Number(size));
  };

  return {
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleSizeChange,
  };
}
