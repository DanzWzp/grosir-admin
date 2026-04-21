import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Gabungkan class tailwind dengan rapi
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format angka ke Rupiah otomatis
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}
