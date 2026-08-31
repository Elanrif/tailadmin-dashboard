"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Addresses } from "@/lib/addresses/component/addresses";
import { useSession } from "@/lib/auth/components/auth.context";

export default function AddressesPage() {
   const { user } = useSession();

   if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 dark:text-gray-400">
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Addresses" />
      <div className="space-y-6">
        <ComponentCard>
          <Addresses queryParams={{ userId: user.id }} />
        </ComponentCard>
      </div>
    </div>
  );
}
