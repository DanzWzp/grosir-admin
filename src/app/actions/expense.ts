"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// Mengambil semua pengeluaran (Sekalian ambil data nama karyawan)
export async function getExpenses() {
  try {
    return await db.expense.findMany({
      include: {
        employee: true, // Tambahkan ini agar nama karyawan muncul di tabel
      },
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
  employeeId?: string; // Tambahkan field ini
}) {
  try {
    await db.expense.create({
      data: {
        title: data.title,
        amount: Number(data.amount),
        category: data.category,
        note: data.note,
        // LOGIKA RELASI KARYAWAN:
        // Jika employeeId ada dan bukan string kosong, hubungkan ke tabel employee
        ...(data.employeeId && data.employeeId !== ""
          ? {
              employee: {
                connect: { id: data.employeeId },
              },
            }
          : {}),
      },
    });

    revalidatePath("/keuangan");
    return { success: true, message: "Pengeluaran berhasil dicatat!" };
  } catch (error) {
    console.error("Gagal mencatat pengeluaran:", error);
    // Tampilkan error lebih detail di console Vercel
    return {
      success: false,
      message: "Gagal menyimpan pengeluaran. Cek relasi database.",
    };
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
