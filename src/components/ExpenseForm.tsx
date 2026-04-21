"use client";

import { useState } from "react";
import { createExpenseAction } from "@/app/actions/expense";
import { Button } from "./ui/Button";
import { Loader2, PlusCircle } from "lucide-react";

export default function ExpenseForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title") as string,
      amount: Number(formData.get("amount")),
      category: formData.get("category") as string,
      note: formData.get("note") as string,
    };

    await createExpenseAction(data);
    (e.target as HTMLFormElement).reset();
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-600 uppercase">
          Nama Pengeluaran
        </label>
        <input
          name="title"
          required
          className="border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Contoh: Gaji Kuli"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-600 uppercase">
          Nominal (Rp)
        </label>
        <input
          name="amount"
          type="number"
          required
          className="border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="100000"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-600 uppercase">
          Kategori
        </label>
        <select
          name="category"
          className="border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Operasional">Operasional</option>
          <option value="Gaji">Gaji Karyawan</option>
          <option value="Listrik/Air">Listrik & Air</option>
          <option value="Lain-lain">Lain-lain</option>
        </select>
      </div>
      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <PlusCircle size={16} />
        )}
        Simpan Pengeluaran
      </Button>
    </form>
  );
}
