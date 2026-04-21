"use client";

import Link from "next/link";
import { useState } from "react";
import { Edit, Trash2, AlertCircle, ImageIcon, X } from "lucide-react";
import { deleteProductAction } from "@/actions/product";
import { formatCurrency } from "@/lib/utils";
import ConfirmModal from "./ui/ConfirmModal"; // Import modal konfirmasi kustom

// Definisi tipe data
type Unit = { id: string; name: string; conversion: number; price: number };
type Product = {
  id: string;
  name: string;
  imageUrl?: string | null;
  stockAlert: number;
  units: Unit[];
};

export default function ProductTable({ products }: { products: Product[] }) {
  // State untuk Modal Hapus
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // State untuk Modal Fullscreen Gambar
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fungsi membuka modal konfirmasi
  const openDeleteModal = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  // Fungsi hapus yang dijalankan dari modal
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteProductAction(deleteId);
    setIsDeleting(false);

    if (result.success) {
      setDeleteId(null); // Tutup modal jika berhasil
    } else {
      alert(result.message);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500 flex flex-col items-center">
        <AlertCircle size={48} className="text-slate-300 mb-2" />
        <p>Belum ada barang di database.</p>
      </div>
    );
  }

  return (
    <>
      {/* MODAL KONFIRMASI HAPUS (Custom & Profesional) */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Barang?"
        message={`Apakah Anda yakin ingin menghapus "${deleteName}"? Data barang dan seluruh satuannya akan dihapus permanen dari sistem.`}
        isLoading={isDeleting}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-800 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold w-20">Foto</th>
                <th className="p-4 font-semibold">Nama Barang</th>
                <th className="p-4 font-semibold">Peringatan Stok</th>
                <th className="p-4 font-semibold">Daftar Satuan & Harga</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* KOLOM FOTO */}
                  <td className="p-4">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        onClick={() =>
                          setSelectedImage(product.imageUrl as string)
                        }
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm cursor-pointer hover:opacity-80 hover:ring-2 hover:ring-blue-400 transition-all"
                        title="Klik untuk memperbesar"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-50 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-slate-200">
                        <ImageIcon size={16} className="opacity-50 mb-0.5" />
                        <span className="text-[9px] font-medium">Kosong</span>
                      </div>
                    )}
                  </td>

                  {/* NAMA BARANG */}
                  <td className="p-4 font-medium text-slate-800">
                    {product.name}
                  </td>

                  {/* PERINGATAN STOK */}
                  <td className="p-4">
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium">
                      &lt; {product.stockAlert} Item
                    </span>
                  </td>

                  {/* DAFTAR SATUAN */}
                  <td className="p-4">
                    <ul className="space-y-1">
                      {product.units.map((unit) => (
                        <li key={unit.id} className="text-xs flex gap-2">
                          <span className="font-semibold text-blue-600">
                            {unit.name}
                          </span>
                          <span className="text-slate-400">|</span>
                          <span>Isi: {unit.conversion}</span>
                          <span className="text-slate-400">|</span>
                          <span>{formatCurrency(unit.price)}</span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  {/* TOMBOL AKSI */}
                  <td className="p-4 flex gap-2 justify-end items-center">
                    <Link
                      href={`/inventory/edit/${product.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Barang"
                    >
                      <Edit size={18} />
                    </Link>

                    <button
                      onClick={() => openDeleteModal(product.id, product.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Barang"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FULLSCREEN GAMBAR (Lightbox) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full flex justify-center animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
            >
              <X size={36} />
            </button>

            <img
              src={selectedImage}
              alt="Preview Full"
              className="max-h-[85vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
