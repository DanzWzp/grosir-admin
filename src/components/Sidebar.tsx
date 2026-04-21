"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import LogoutButton from "@/components/ui/LogoutButton";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Stok Barang", icon: Box, href: "/inventory" },
  { name: "Transaksi", icon: ShoppingCart, href: "/transactions" },
  { name: "Keuangan", icon: Wallet, href: "/finance" },
  { name: "Kontak", icon: Users, href: "/contacts" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Jika belum mounted, jangan render apapun untuk menghindari mismatch
  if (!mounted) return null;

  return (
    <>
      {/* 1. TOMBOL MENU - Gunakan ID unik agar browser tidak bingung */}
      <button
        id="mobile-menu-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] p-2 bg-slate-900 text-white rounded-lg md:hidden border border-slate-700 shadow-2xl"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 2. OVERLAY - Selalu ada di DOM, mainkan visibilitas saja */}
      <div
        className={`fixed inset-0 bg-black/60 z-[40] md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 3. SIDEBAR CONTAINER */}
      <div
        className={`
          w-64 bg-slate-900 h-screen text-white fixed left-0 top-0 p-4 border-r border-slate-800 
          flex flex-col z-[50] transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="text-xl font-bold mb-8 px-4 mt-12 md:mt-4 text-blue-400">
          SalhaShop{" "}
          <span className="text-xs block text-slate-400 mt-1">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                type="button"
                // MENGGUNAKAN WINDOW.LOCATION UNTUK NAVIGASI BERSIH
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = item.href;
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 mt-auto border-t border-slate-800">
          <div className="px-3 mb-4">
            <p className="text-sm font-bold text-slate-200">Admin Toko</p>
            <p className="text-[10px] text-slate-500 truncate">
              admin@salhashop.com
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </>
  );
}
