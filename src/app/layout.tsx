import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SalhaShop",
  description: "Sistem Manajemen Grosir SalhaShop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Tanpa Sidebar, murni hanya background bawaan */}
      <body className="bg-slate-50 antialiased text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
