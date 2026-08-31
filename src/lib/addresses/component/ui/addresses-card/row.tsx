"use client";

import { Eye, MapPin, Pencil, Trash2 } from "lucide-react";
import { Address } from "@/lib/addresses/api/types";

type RowProps = {
  address: Address;
  onView: (address: Address) => void;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
};

export function Row({ address, onView, onEdit, onDelete }: RowProps) {
  const isDefault = address.defaultAddress;

  return (
    <div
      className={`
        group relative rounded-xl border
        px-4 py-4
        transition-colors
        ${
          isDefault
            ? `
              border-blue-500 bg-blue-700
              hover:bg-blue-600
              dark:border-blue-400 dark:bg-blue-800
              dark:hover:bg-blue-700
            `
            : `
              border-blue-800 bg-blue-900
              hover:bg-blue-800
              dark:border-blue-950 dark:bg-blue-900
              dark:hover:bg-blue-800
            `
        }
      `}
    >
      {/* Default badge */}
      {isDefault && (
        <div
          className="
            absolute left-3 top-3
            rounded-full bg-white/15
            px-2 py-0.5
            text-[10px] font-medium text-white
            backdrop-blur-sm
          "
        >
          Adresse par défaut
        </div>
      )}

      {/* Actions */}
      <div className="absolute right-3 top-3 flex items-center gap-0.5">
        {/* View */}
        <button
          type="button"
          aria-label="Voir l'adresse"
          title="Voir"
          onClick={() => onView(address)}
          className="
            flex h-7 w-7 items-center justify-center rounded-md
            text-gray-300 transition-colors
            hover:bg-white/10 hover:text-white
            dark:text-gray-400
            dark:hover:bg-white/10 dark:hover:text-white
          "
        >
          <Eye className="h-3.5 w-3.5" />
        </button>

        {/* Edit */}
        <button
          type="button"
          aria-label="Modifier l'adresse"
          title="Modifier"
          onClick={() => onEdit(address)}
          className="
            flex h-7 w-7 items-center justify-center rounded-md
            text-gray-300 transition-colors
            hover:bg-white/10 hover:text-white
            dark:text-gray-400
            dark:hover:bg-white/10 dark:hover:text-white
          "
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>

        {/* Delete */}
        <button
          type="button"
          aria-label="Supprimer l'adresse"
          title="Supprimer"
          onClick={() => onDelete(address)}
          className="
            flex h-7 w-7 items-center justify-center rounded-md
            text-gray-300 transition-colors
            hover:bg-red-500/20 hover:text-red-200
            dark:text-gray-400
            dark:hover:bg-red-500/20 dark:hover:text-red-300
          "
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Main content */}
      <div
        className={`
          flex flex-col items-center text-center
          ${isDefault ? "pt-4" : ""}
        `}
      >
        {/* Map icon */}
        <div
          className="
            mb-2 flex h-12 w-12 items-center justify-center rounded-full
            bg-white/10 text-white
            dark:bg-white/10 dark:text-gray-100
          "
        >
          <MapPin className="h-6 w-6" />
        </div>

        {/* City */}
        <h3 className="text-sm font-semibold text-white">
          {address.city || "Adresse"}
        </h3>

        {/* Secondary information */}
        <div
          className="
            mt-1 flex items-center gap-2
            text-xs text-gray-300
            dark:text-gray-400
          "
        >
          {address.country && <span>{address.country}</span>}

          {address.country && address.postalCode && (
            <span className="text-gray-500 dark:text-gray-600">•</span>
          )}

          {address.postalCode && <span>{address.postalCode}</span>}
        </div>
      </div>
    </div>
  );
}
