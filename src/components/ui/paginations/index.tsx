import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

// =========================================================
// Types
// =========================================================

type PaginationVariant = "text" | "icon" | "both";

interface BasePaginationProps {
  variant?: PaginationVariant;
  onPageChange?: (page: number) => void;

  /**
   * Permet d'activer/désactiver la modification de l'URL.
   *
   * Par défaut :
   * - mode client  => true
   * - mode server  => false
   */
  updateUrl?: boolean;

  /**
   * Nom du paramètre utilisé dans l'URL.
   *
   * Exemple :
   * page
   * addressPage
   */
  urlParam?: string;
}

// =========================================================
// Client pagination
// =========================================================

interface ClientPaginationProps extends BasePaginationProps {
  mode: "client";
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: never;
  totalPages?: never;
}

// =========================================================
// Server pagination
// =========================================================

interface ServerPaginationProps extends BasePaginationProps {
  mode: "server";
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
}

type UnifiedPaginationProps = ClientPaginationProps | ServerPaginationProps;

// =========================================================
// Pagination Controls
// =========================================================

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <UnifiedPagination
      mode="server"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      variant="both"
      updateUrl={false}
    />
  );
}

// =========================================================
// Unified Pagination
// =========================================================

export function UnifiedPagination(props: UnifiedPaginationProps) {
  const {
    mode,
    variant = "both",
    onPageChange,
    itemsPerPage = 10,

    // Par défaut :
    // client => URL activée
    // server => URL désactivée
    updateUrl: shouldUpdateUrl = mode === "client",

    // Paramètre URL par défaut
    urlParam = "page",
  } = props;

  // =========================================================
  // State
  // =========================================================

  const [localCurrentPage, setLocalCurrentPage] = useState(1);

  // =========================================================
  // Pagination mode
  // =========================================================

  const isClient = mode === "client";

  const totalPages = isClient
    ? Math.ceil(props.totalItems / itemsPerPage)
    : props.totalPages;

  const currentPage = isClient ? localCurrentPage : props.currentPage;

  const totalItems = props.totalItems;

  // =========================================================
  // Client : récupération de la page depuis l'URL
  // =========================================================

  useEffect(() => {
    if (!isClient) return;

    const params = new URLSearchParams(window.location.search);

    const pageParam = params.get(urlParam);

    if (pageParam) {
      const page = parseInt(pageParam, 10);

      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalCurrentPage(page);
      }
    }
  }, [isClient, totalPages, urlParam]);

  // =========================================================
  // Update URL
  // =========================================================

  const updateUrl = (page: number) => {
    const url = new URL(window.location.href);

    url.searchParams.set(urlParam, page.toString());

    window.history.pushState({}, "", url.toString());
  };

  // =========================================================
  // Page change
  // =========================================================

  const handlePageChange = (page: number) => {
    // Sécurité
    if (page === currentPage || page < 1 || page > totalPages) {
      return;
    }

    // Mode client :
    // la pagination est contrôlée localement
    if (isClient) {
      setLocalCurrentPage(page);
    }

    // Modification de l'URL uniquement
    // si explicitement autorisée
    if (shouldUpdateUrl) {
      updateUrl(page);
    }

    // Toujours notifier le parent
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // =========================================================
  // Generate page numbers
  // =========================================================

  const getPageNumbers = () => {
    const delta = 2;

    const range: number[] = [];

    const rangeWithDots: (number | string)[] = [];

    let lastPage: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((page) => {
      if (lastPage !== undefined) {
        if (page - lastPage === 2) {
          rangeWithDots.push(lastPage + 1);
        } else if (page - lastPage !== 1) {
          rangeWithDots.push("...");
        }
      }

      rangeWithDots.push(page);

      lastPage = page;
    });

    return rangeWithDots;
  };

  // =========================================================
  // Nothing to paginate
  // =========================================================

  if (totalPages <= 1) {
    return null;
  }

  // =========================================================
  // Previous / Next configuration
  // =========================================================

  const prevNextConfig = {
    showIcon: variant === "icon" || variant === "both",

    showText: variant === "text" || variant === "both",
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      {/* =====================================================
          Information
      ===================================================== */}

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {totalItems !== undefined ? (
          <>
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}{" "}
            to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
            {totalItems} items
          </>
        ) : (
          <>
            Page {currentPage} of {totalPages}
          </>
        )}
      </div>

      {/* =====================================================
          Pagination
      ===================================================== */}

      <Pagination>
        <PaginationContent className="justify-center gap-2">
          {/* =================================================
              Previous
          ================================================= */}

          <PaginationItem>
            <PaginationPrevious
              href="#"
              showIcon={prevNextConfig.showIcon}
              showText={prevNextConfig.showText}
              onClick={(e) => {
                e.preventDefault();

                handlePageChange(currentPage - 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>

          {/* =================================================
              Page numbers
          ================================================= */}

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    handlePageChange(page as number);
                  }}
                  isActive={currentPage === page}
                  className={`p-5 border border-gray-300 ${
                    currentPage === page
                      ? "bg-brand-500 text-white hover:bg-brand-600 hover:text-white dark:bg-brand-600"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* =================================================
              Next
          ================================================= */}

          <PaginationItem>
            <PaginationNext
              href="#"
              showIcon={prevNextConfig.showIcon}
              showText={prevNextConfig.showText}
              onClick={(e) => {
                e.preventDefault();

                handlePageChange(currentPage + 1);
              }}
              className={`p-5 border border-gray-300 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
