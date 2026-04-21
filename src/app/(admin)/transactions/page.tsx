import db from "@/lib/db";
import Link from "next/link";
import {
  Plus,
  ShoppingCart,
  Calendar,
  TrendingUp,
  History,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import TransactionRow from "@/components/TransactionRow"; // Import komponen baru

export default async function TransactionsPage() {
  const transactions = await db.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 10,
  });

  const totalOmzet = transactions.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Data Penjualan
          </h1>
          <p className="text-slate-500 mt-1">
            Monitoring arus transaksi SalhaShop Anda.
          </p>
        </div>

        <Link href="/transactions/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2">
            <Plus size={18} />
            Transaksi Baru
          </Button>
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Omzet
            </p>
            <p className="text-xl font-bold text-slate-800">
              Rp {totalOmzet.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <ShoppingCart size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Pesanan Selesai
            </p>
            <p className="text-xl font-bold text-slate-800">
              {transactions.length} Transaksi
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <History size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Update Terakhir
            </p>
            <p className="text-xl font-bold text-slate-800">Hari Ini</p>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            Riwayat Transaksi
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 border-slate-200"
          >
            <Download size={16} className="mr-2" /> Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  No. Faktur
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    Belum ada transaksi tercatat.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  // Gunakan Komponen Client di sini
                  <TransactionRow key={trx.id} trx={trx} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
