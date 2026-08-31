"use client";

import { MapPin, Plus } from "lucide-react";

import Button from "@/components/ui/button/Button";

type AddressEmptyStateProps = {
  onAdd: () => void;
};

export function NoResult({ onAdd }: AddressEmptyStateProps) {
  return (
    <div className="col-span-full rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-6 py-16 text-center dark:border-blue-900/50 dark:bg-blue-950/20">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
        <MapPin className="h-6 w-6 text-blue-500 dark:text-blue-400" />
      </div>

      <h3 className="font-medium text-gray-900 dark:text-white">
        Aucune adresse
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        Cet utilisateur ne possède encore aucune adresse enregistrée.
      </p>

      <div className="mt-5">
        <Button
          size="sm"
          variant="primary"
          startIcon={<Plus size={16} />}
          onClick={onAdd}
        >
          Ajouter une adresse
        </Button>
      </div>
    </div>
  );
}
