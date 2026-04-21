"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// Mengambil semua pengeluaran
export async function getExpenses() {
  try {
    return await db.expense.findMany({
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.error("Gagal mengambil pengeluaran:", error);
    return [];
  }
}

// Menambah pengeluaran baru
export async function createExpenseAction(data: {
  title: string;
  amount: number;
  category: string;
  note?: string;
}) {
  try {
    await db.expense.create({
      data: {
        title: data.title,
        amount: Number(data.amount),
        category: data.category,
        note: data.note,
      },
    });

    revalidatePath("/keuangan");
    return { success: true, message: "Pengeluaran berhasil dicatat!" };
  } catch (error) {
    console.error("Gagal mencatat pengeluaran:", error);
    return { success: false, message: "Gagal menyimpan pengeluaran." };
  }
}

// Menghapus pengeluaran
export async function deleteExpenseAction(id: string) {
  try {
    await db.expense.delete({ where: { id } });
    revalidatePath("/keuangan");
    return { success: true, message: "Catatan pengeluaran dihapus." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus data." };
  }
}
