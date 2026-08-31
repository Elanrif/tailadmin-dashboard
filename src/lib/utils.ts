import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: readonly { key: keyof T; label: string }[],
  filename: string = "export.csv",
) {
  if (data.length === 0) return;

  const csvRows = [
    "sep=;", // Indique les cellules à Excel
    columns.map((col) => col.label).join(";"), // En-têtes (Téléphone, Rôle...)
    ...data.map((row) =>
      columns
        .map((col) => {
          const val = row[col.key] ?? "";
          const escaped = String(val).replace(/"/g, '""');

          if (col.key === "phoneNumber" || col.key === "telephone") {
            return `="${escaped}"`; // Protège le numéro de téléphone
          }

          return escaped.includes(";") || escaped.includes("\n")
            ? `"${escaped}"`
            : escaped;
        })
        .join(";"),
    ),
  ];

  const csvString = csvRows.join("\n");

  // 💡 LA CORRECTION RADICALE POUR EXCEL WINDOWS :
  // Au lieu de forcer l'UTF-8, on convertit la chaîne en codage "Binary/ANSI" (Windows-1252)
  // en s'assurant que les caractères comme é ou ô passent de manière native pour Excel.
  const buffer = new ArrayBuffer(csvString.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < csvString.length; i++) {
    view[i] = csvString.charCodeAt(i) & 0xff;
  }

  // On crée le Blob en mode binaire brut (sans forcer le charset utf-8 qui sème la confusion)
  const blob = new Blob([buffer], { type: "text/csv;charset=ansi;" });

  // Téléchargement
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}