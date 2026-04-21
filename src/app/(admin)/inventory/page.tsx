import ProductForm from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";
import db from "@/lib/db";

export default async function InventoryPage() {
  // Mengambil semua data barang dari database untuk ditampilkan di tabel
  const products = await db.product.findMany({
    include: {
      units: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Inventaris Barang</h1>
        <p className="text-slate-500">
          Kelola stok dan harga satuan barang SalhaShop Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Bagian Atas: Form untuk Tambah Barang Baru */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-700">
            Tambah Barang Baru
          </h2>
          <ProductForm />
        </section>

        {/* Bagian Bawah: Tabel untuk List Barang */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-700">
            Daftar Barang
          </h2>
          <ProductTable products={products} />
        </section>
      </div>
    </div>
  );
}
