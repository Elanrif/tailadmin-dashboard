"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

const USER_COLUMNS = [
  "ID",
  "Title",
  "Description",
  "Author",
  "comments",
  "Likes",
  "Created",
  "Actions",
] as const;

export function Columns() {
  return (
    <TableRow>
      {USER_COLUMNS.map((header) => (
        <TableCell
          key={header}
          isHeader
          className="text-center px-3 py-3 font-medium text-theme-xs"
        >
          {header}
        </TableCell>
      ))}
    </TableRow>
  );
}
