import db from "@/lib/db";
import Link from "next/link";
import {
  Package,
  ArrowUpCircle,
  AlertTriangle,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Banknote,
} from "lucide-react";
// 1. PERBAIKAN: Jika masih merah, pastikan file src/components/DashboardChart.tsx sudah ada
import DashboardChart from "@/components/DashboardChart";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  try {
    const products = await db.product.findMany({
      orderBy: { stock: "asc" },
    });

    const lowStockProducts = products.filter(
      (p) => (p.stock || 0) <= (p.stockAlert || 0),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = await db.transaction.findMany({
      where: { createdAt: { gte: today } },
      include: { items: true },
    });

    let omzetHariIni = 0;
    let modalHariIni = 0;

    todayTransactions.forEach((trx) => {
      omzetHariIni += trx.totalAmount || 0;
      // 2. PERBAIKAN: Type casting ke 'any' jika Prisma belum generate ulang
      trx.items.forEach((item: any) => {
        modalHariIni += (item.buyPriceAtTime || 0) * item.quantity;
      });
    });

    const labaKotorHariIni = omzetHariIni - modalHariIni;

    // 3. PERBAIKAN: Pastikan di schema.prisma namanya 'expense' (huruf kecil)
    const todayExpenses = await db.expense.findMany({
      where: { date: { gte: today } },
    });

    // 4 & 5. PERBAIKAN: Memberikan tipe data 'number' pada sum dan 'any' pada e
    const totalPengeluaranHariIni = todayExpenses.reduce(
      (sum: number, e: any) => sum + (e.amount || 0),
      0,
    );

    const labaBersihHariIni = labaKotorHariIni - totalPengeluaranHariIni;

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dailyTrx = await db.transaction.findMany({
        where: { createdAt: { gte: d, lt: nextD } },
      });

      const total = dailyTrx.reduce(
        (sum: number, t: any) => sum + (t.totalAmount || 0),
        0,
      );
      last7Days.push({
        name: d.toLocaleDateString("id-ID", { weekday: "short" }),
        omzet: total,
      });
    }

    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        {/* ... (Konten return tetap sama seperti sebelumnya) ... */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 italic">
              Salha Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Performa toko SalhaShop hari ini.
            </p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200">
            {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            title="Omzet Hari Ini"
            value={`Rp ${omzetHariIni.toLocaleString()}`}
            icon={ArrowUpCircle}
            color="blue"
          />
          <StatCard
            title="Laba Bersih"
            value={`Rp ${labaBersihHariIni.toLocaleString()}`}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Transaksi"
            value={`${todayTransactions.length} Nota`}
            icon={ShoppingCart}
            color="purple"
          />
          <StatCard
            title="Total Aset"
            value={`${products.length} Item`}
            icon={Package}
            color="amber"
          />
          <StatCard
            title="Stok Menipis"
            value={`${lowStockProducts.length} Produk`}
            icon={AlertTriangle}
            color={lowStockProducts.length > 0 ? "red" : "slate"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Banknote className="text-blue-600" size={20} />
              Grafik Penjualan (7 Hari Terakhir)
            </h3>
            <div className="h-[300px] w-full">
              <DashboardChart data={last7Days} />
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                Stok Menipis
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[300px]">
              {lowStockProducts.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">
                  Semua stok aman.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 flex justify-between items-center hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase">
                          Sisa: {p.stock}
                        </p>
                      </div>
                      <Link
                        href="/inventory"
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Gagal memuat Dashboard.
      </div>
    );
  }
}

function StatCard({ title, value, icon: Icon, color }: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    slate: "bg-slate-50 text-slate-500 border-slate-100",
  };

  return (
    <div
      className={`bg-white p-5 rounded-2xl border ${colors[color].split(" ")[2]} shadow-sm flex flex-col gap-3 hover:shadow-md transition-all`}
    >
      <div
        className={`w-fit p-2 rounded-xl ${colors[color].split(" ").slice(0, 2).join(" ")}`}
      >
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {title}
        </p>
        <p className="text-lg font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}
