"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// 1. Tambahkan 'size' ke dalam interface props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg"; // <-- Menambahkan pilihan ukuran
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md", // <-- Default ukuran ke 'md'
      isLoading,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100",
      outline:
        "border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-red-100",
      ghost: "bg-transparent text-slate-500 hover:bg-slate-100",
    };

    // 2. Tambahkan pengaturan padding dan teks berdasarkan ukuran
    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isLoading || disabled}
        suppressHydrationWarning
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size], // <-- Gunakan ukuran di sini
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 size={size === "sm" ? 14 : 18} className="animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
