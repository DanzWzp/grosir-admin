import db from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet,
  ArrowDownCircle,
  ReceiptText,
  TrendingUp,
  CalendarDays,
  Package, // Icon baru untuk Aset
} from "lucide-react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";

export default async function FinancePage() {
  // 1. Ambil Data Transaksi & Detail Item
  const transactions = await db.transaction.findMany({
    include: { items: true },
  });

  // 2. Ambil Data Pengeluaran Operasional
  const expenses = await db.expense.findMany({
    orderBy: { date: "desc" },
  });

  // 3. Ambil Data Produk & Unit (Untuk Saran 2: Nilai Aset)
  const products = await db.product.findMany({
    include: { units: true },
  });

  // --- LOGIKA PERHITUNGAN ---
  let totalOmzet = 0;
  let totalModalTerjual = 0;

  // Hitung Laba Kotor dari Transaksi
  transactions.forEach((tx) => {
    totalOmzet += tx.totalAmount;
    tx.items.forEach((item) => {
      totalModalTerjual += (item.buyPriceAtTime || 0) * item.quantity;
    });
  });

  // Hitung Nilai Aset Stok (Modal yang sedang mengendap di gudang)
  let totalNilaiAset = 0;
  products.forEach((product) => {
    // Kita ambil unit dengan conversion terkecil (biasanya 1) sebagai acuan modal dasar
    const baseUnit =
      product.units.find((u) => u.conversion === 1) || product.units[0];
    if (baseUnit) {
      totalNilaiAset += (baseUnit.buyPrice || 0) * product.stock;
    }
  });

  const totalPengeluaran = expenses.reduce(
    (acc: number, curr: any) => acc + curr.amount,
    0,
  );
  const labaKotor = totalOmzet - totalModalTerjual;
  const labaBersih = labaKotor - totalPengeluaran;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Halaman */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full text-xs font-bold mb-2">
            <CalendarDays size={14} />
            Laporan Real-time
          </div>
          <h1 className="text-2xl font-bold text-slate-800 italic">
            Finance & Assets
          </h1>
          <p className="text-sm text-slate-500">
            Pantau laba bersih dan nilai modal barang yang tersedia di
            SalhaShop.
          </p>
        </div>
      </div>

      {/* Grid Ringkasan Kartu - Diubah ke lg:grid-cols-5 agar muat 5 kartu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Kartu Omzet */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Omzet
            </span>
            <ReceiptText size={18} className="text-blue-500" />
          </div>
          <p className="text-lg font-black text-slate-800">
            {formatCurrency(totalOmzet)}
          </p>
        </div>

        {/* Kartu Pengeluaran */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Biaya Ops
            </span>
            <ArrowDownCircle size={18} className="text-orange-500" />
          </div>
          <p className="text-lg font-black text-slate-800">
            {formatCurrency(totalPengeluaran)}
          </p>
        </div>

        {/* Kartu Laba Kotor */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Laba Kotor
            </span>
            <TrendingUp size={18} className="text-purple-500" />
          </div>
          <p className="text-lg font-black text-slate-800">
            {formatCurrency(labaKotor)}
          </p>
        </div>

        {/* SARAN 2: Kartu Nilai Aset Stok */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
              Aset Barang
            </span>
            <Package size={18} className="text-amber-500" />
          </div>
          <p className="text-lg font-black text-slate-800">
            {formatCurrency(totalNilaiAset)}
          </p>
        </div>

        {/* Kartu Laba Bersih */}
        <div
          className={`p-5 rounded-2xl border shadow-md transition-all transform hover:scale-[1.02] ${
            labaBersih >= 0
              ? "bg-slate-900 border-green-500/50 text-white"
              : "bg-red-900 border-red-500/50 text-white"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Laba Bersih
            </span>
            <Wallet
              size={18}
              className={labaBersih >= 0 ? "text-green-400" : "text-white"}
            />
          </div>
          <p
            className={`text-lg font-black ${labaBersih >= 0 ? "text-green-400" : "text-white"}`}
          >
            {formatCurrency(labaBersih)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Input Pengeluaran */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="font-bold text-slate-800">Catat Pengeluaran</h2>
            </div>
            <ExpenseForm />
          </div>
        </div>

        {/* Kolom Kanan: Daftar Riwayat */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[450px]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="font-bold text-slate-800">Log Kas Keluar</h2>
            </div>
            <ExpenseList initialData={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}
