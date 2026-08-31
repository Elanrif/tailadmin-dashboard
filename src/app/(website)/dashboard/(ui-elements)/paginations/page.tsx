"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { UnifiedPagination } from "@/components/ui/paginations";
import { usePagination } from "@/hooks/use-pagination";
import React from "react";

export default function Paginations() {
  const totalItems = 30;
  const itemsPerPage = 10;

  const { currentPage, totalPages, goToPage } = usePagination(
    totalItems,
    itemsPerPage,
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Paginations" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard
          title="pagination controls"
          desc="Basic pagination controls with page numbers and next/previous buttons."
        >
          <UnifiedPagination
            mode="client"
            totalItems={30}
            itemsPerPage={10}
            variant="text"
          />
        </ComponentCard>
        <ComponentCard title="Pagination with Text">
          <UnifiedPagination
            mode="client"
            totalItems={20}
            variant="icon"
            onPageChange={(page) => console.log("Page modifiée:", page)}
          />
        </ComponentCard>

        <ComponentCard title="Pagination with Icon">
          <UnifiedPagination mode="client" totalItems={20} variant="both" />
        </ComponentCard>
      </div>
    </div>
  );
}
