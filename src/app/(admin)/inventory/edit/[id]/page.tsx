import ProductForm from "@/components/ProductForm";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  // 1. Ambil ID dari URL (Wajib di-await di Next.js terbaru)
  const params = await props.params;
  const id = params.id;

  // 2. Cari data barang spesifik berdasarkan ID tersebut
  const product = await db.product.findUnique({
    where: { id: id },
    // Pastikan relasi 'units' sesuai dengan schema Prisma Anda
    include: { units: true },
  });

  // 3. Jika ID salah atau barang tidak ada, balikkan ke halaman utama
  if (!product) {
    redirect("/inventory");
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link
          href="/inventory"
          className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Edit Data Barang
          </h1>
          <p className="text-slate-500 text-sm">
            Mengubah informasi: {product.name}
          </p>
        </div>
      </div>

      {/* Tampilkan Form yang sama, tapi kita kirim 'initialData' */}
      <div className="bg-white rounded-xl">
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}
