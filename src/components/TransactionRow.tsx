"use client";

import { useState } from "react";
import {
  Trash2,
  Edit,
  ArrowUpRight,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  deleteTransaction,
  updateTransactionCustomer,
} from "@/app/actions/transaction";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TransactionRow({ trx }: { trx: any }) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editName, setEditName] = useState(trx.customerName || "Umum");

  const confirmDelete = async () => {
    setIsDeleting(true);
    const res = await deleteTransaction(trx.id);

    if (res.success) {
      setShowDeleteModal(false);
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus transaksi");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const confirmEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName.trim() || editName === trx.customerName) {
      setShowEditModal(false);
      return;
    }

    setIsEditing(true);
    const res = await updateTransactionCustomer(trx.id, editName);

    if (res.success) {
      setShowEditModal(false);
      router.refresh();
    } else {
      alert(res.error || "Gagal mengedit transaksi");
    }
    setIsEditing(false);
  };

  if (isDeleting && !showDeleteModal) return null;

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="p-4">
        <span className="font-medium text-blue-600">{trx.invoiceNumber}</span>
      </td>
      <td className="p-4 text-sm text-slate-600">
        {new Date(trx.createdAt).toLocaleDateString("id-ID")}
      </td>
      <td className="p-4 text-sm font-medium text-slate-700">
        {trx.customerName || "Umum"}
      </td>
      <td className="p-4 text-sm font-bold text-slate-800">
        Rp {trx.totalAmount.toLocaleString("id-ID")}
      </td>
      <td className="p-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Selesai
        </span>
      </td>

      {/* SEMUA BUTTON DAN MODAL BERADA DI DALAM SATU <td> INI */}
      <td className="p-4 text-center">
        <div className="flex justify-center items-center gap-1">
          <button
            onClick={() => {
              setEditName(trx.customerName || "Umum");
              setShowEditModal(true);
            }}
            className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-colors"
            title="Edit Pelanggan"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="Hapus Transaksi"
          >
            <Trash2 size={16} />
          </button>

          <Link
            href={`/print/${trx.id}`}
            target="_blank"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Cetak Struk"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* POP-UP MODAL: HAPUS TRANSAKSI (Valid karena di dalam <td>) */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Hapus Transaksi?
                </h3>
                <p className="text-slate-500 text-sm">
                  Anda yakin ingin menghapus transaksi{" "}
                  <strong className="text-slate-700">
                    {trx.invoiceNumber}
                  </strong>
                  ? Data yang dihapus tidak dapat dikembalikan.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200 transition-colors flex items-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POP-UP MODAL: EDIT NAMA PELANGGAN (Valid karena di dalam <td>) */}
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg">
                  Edit Pelanggan
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={confirmEdit}>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">
                      Nama Pelanggan Baru
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={isEditing}
                      placeholder="Masukkan nama pelanggan..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    disabled={isEditing}
                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isEditing || !editName.trim()}
                    className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isEditing && (
                      <Loader2 size={18} className="animate-spin" />
                    )}
                    {isEditing ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
