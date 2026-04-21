import db from "@/lib/db";
import { notFound } from "next/navigation";
import { Printer } from "lucide-react";

export default async function InvoicePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const transaction = await db.transaction.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!transaction) return notFound();

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center py-10 font-mono text-slate-800">
      <div className="fixed top-5 right-5 print:hidden">
        {/* 1. Hapus onClick, tambahkan id="print-btn" */}
        <button
          id="print-btn"
          className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all font-bold font-sans"
        >
          <Printer size={20} /> Cetak / Simpan PDF
        </button>
      </div>

      <div className="bg-white p-8 w-full max-w-[400px] shadow-2xl print:shadow-none print:p-0">
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-2xl font-black tracking-widest uppercase">
            SalhaShop
          </h1>
          <p className="text-xs text-slate-500">
            Jl. Contoh Alamat No. 123, Kota Anda
          </p>
          <p className="text-xs text-slate-500">Telp: 0812-3456-7890</p>
        </div>

        <div className="border-t-2 border-dashed border-slate-300 my-4" />

        <div className="text-xs space-y-1.5 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Waktu</span>
            <span className="font-bold">
              {new Date(transaction.createdAt).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">No. Faktur</span>
            <span className="font-bold">{transaction.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Pelanggan</span>
            <span className="font-bold">
              {transaction.customerName || "Umum"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Kasir</span>
            <span className="font-bold">Admin</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-slate-300 my-4" />

        <div className="space-y-4 mb-4">
          {transaction.items.map((item: any) => (
            <div key={item.id} className="text-xs">
              <div className="font-bold mb-1">{item.productId}</div>
              <div className="flex justify-between text-slate-600">
                <span>
                  {item.quantity} {item.unitName} x{" "}
                  {item.priceAtTime.toLocaleString("id-ID")}
                </span>
                <span className="font-bold text-slate-800">
                  {item.subtotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-dashed border-slate-300 my-4" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-bold">
              {transaction.totalAmount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-black">TOTAL</span>
            <span className="font-black">
              Rp {transaction.totalAmount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-slate-500">Tunai</span>
            <span>{transaction.payAmount.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Kembalian</span>
            <span>{transaction.changeAmount.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-slate-300 my-6" />

        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase">Terima Kasih</p>
          <p className="text-[10px] text-slate-500">
            Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.
          </p>
        </div>
      </div>

      {/* 2. Script ini akan mencari tombol dengan ID "print-btn" lalu menjalankan window.print() */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.getElementById('print-btn').addEventListener('click', function() {
            window.print();
          });
        `,
        }}
      />
    </div>
  );
}
