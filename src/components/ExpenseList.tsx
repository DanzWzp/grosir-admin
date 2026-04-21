"use client";

import { deleteExpenseAction } from "@/app/actions/expense";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function ExpenseList({ initialData }: { initialData: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
            <th className="py-3 px-2">Tanggal</th>
            <th className="py-3 px-2">Keterangan</th>
            <th className="py-3 px-2">Kategori</th>
            <th className="py-3 px-2 text-right">Nominal</th>
            <th className="py-3 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {initialData.map((item) => (
            <tr
              key={item.id}
              className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
            >
              <td className="py-3 px-2 text-slate-500">
                {new Date(item.date).toLocaleDateString("id-ID")}
              </td>
              <td className="py-3 px-2 font-medium text-slate-700">
                {item.title}
              </td>
              <td className="py-3 px-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                  {item.category}
                </span>
              </td>
              <td className="py-3 px-2 text-right font-bold text-red-600">
                -{formatCurrency(item.amount)}
              </td>
              <td className="py-3 px-2 text-right">
                <button
                  onClick={() => deleteExpenseAction(item.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {initialData.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-8 text-center text-slate-400 italic"
              >
                Belum ada catatan pengeluaran.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
