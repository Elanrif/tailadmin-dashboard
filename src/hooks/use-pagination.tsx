import { useEffect, useState } from "react";

export function usePagination(totalItems: number, itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Restaurer la page depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");

    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setTimeout(() => {
          setCurrentPage(page);
        }, 0);
      }
    }
  }, [totalPages]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    // Mettre à jour l'URL
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    window.history.pushState({}, "", url.toString());
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = <T,>(data: T[]) => data.slice(startIndex, endIndex);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    paginatedData,
    itemsPerPage,
  };
}
