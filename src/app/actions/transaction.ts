"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * FUNGSI: SIMPAN TRANSAKSI BARU & POTONG STOK
 */
export async function createTransactionAction(data: any) {
  try {
    // 1. Mulai transaksi database (Atomic Transaction)
    const result = await db.$transaction(async (tx) => {
      // GENERATE INVOICE NUMBER (Jika tidak dikirim dari front-end)
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
      const timestamp = Math.floor(date.getTime() / 1000)
        .toString()
        .slice(-4);
      const generatedInvoice =
        data.invoiceNumber || `TRX-${dateStr}-${timestamp}`;

      // 2. Buat record transaksi utama dan itemnya
      const newTransaction = await tx.transaction.create({
        data: {
          invoiceNumber: generatedInvoice,
          customerName: data.customerName || "Umum",
          totalAmount: Number(data.totalAmount),
          payAmount: Number(data.payAmount),
          changeAmount: Number(data.changeAmount),
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              unitName: item.unitName,
              quantity: Number(item.quantity),
              priceAtTime: Number(item.priceAtTime),
              // PERBAIKAN: Gunakan buyPriceAtTime sesuai yang dikirim dari page.tsx
              buyPriceAtTime: Number(item.buyPriceAtTime) || 0,
              subtotal: Number(item.subtotal),
            })),
          },
        },
        include: { items: true },
      });

      // 3. LOGIKA POTONG STOK OTOMATIS
      for (const item of data.items) {
        // Cari data unit untuk mendapatkan nilai konversinya
        const unit = await tx.unit.findFirst({
          where: {
            productId: item.productId,
            name: item.unitName,
          },
        });

        // Hitung berapa total qty satuan terkecil yang harus dikurangi
        // Contoh: Jual 1 Dus, konversi 40, maka stok berkurang 40 pcs.
        const totalQtyToDeduct =
          Number(item.quantity) * (unit?.conversion || 1);

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: totalQtyToDeduct,
            },
          },
        });
      }

      return newTransaction;
    });

    // REVALIDASI CACHE
    revalidatePath("/finance");
    revalidatePath("/transactions");
    revalidatePath("/stok"); // Sesuaikan dengan path menu stok Anda

    return { success: true, data: result };
  } catch (error: any) {
    console.error("❌ GAGAL TRANSAKSI:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan transaksi",
      error: error.message,
    };
  }
}

/**
 * FUNGSI: EDIT NAMA PELANGGAN
 */
export async function updateTransactionCustomer(id: string, newName: string) {
  try {
    await db.transaction.update({
      where: { id },
      data: { customerName: newName },
    });
    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Gagal update nama:", error);
    return { success: false, error: "Gagal mengubah nama pelanggan" };
  }
}

/**
 * FUNGSI: HAPUS TRANSAKSI
 */
export async function deleteTransaction(id: string) {
  try {
    await db.transaction.delete({
      where: { id },
    });

    revalidatePath("/transactions");
    revalidatePath("/finance");
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus transaksi:", error);
    return { success: false, error: "Gagal menghapus data transaksi" };
  }
}
