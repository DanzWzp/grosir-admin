"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function searchProducts(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const products = await db.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        units: true,
      },
      take: 8,
    });
    return products;
  } catch (error) {
    console.error("Gagal mencari barang:", error);
    return [];
  }
}

export async function createProductAction(data: any) {
  try {
    const stockValue = Number(data.stock) || 0;
    const stockAlertValue = Number(data.stockAlert) || 0;

    await db.product.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        stockAlert: stockAlertValue,
        stock: stockValue,
        units: {
          create: data.units.map((unit: any) => ({
            name: unit.name,
            conversion: Number(unit.conversion) || 1,
            price: Number(unit.price) || 0,
            // --- HARGA MODAL WAJIB ADA DI SINI JUGA ---
            buyPrice: Number(unit.buyPrice) || 0,
          })),
        },
      },
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Barang berhasil ditambahkan!" };
  } catch (error) {
    console.error("Gagal tambah barang:", error);
    return { success: false, message: "Gagal menyimpan barang ke database." };
  }
}

export async function updateProductAction(id: string, data: any) {
  try {
    const stockValue = Number(data.stock) || 0;
    const stockAlertValue = Number(data.stockAlert) || 0;

    // 1. Lakukan Update
    const result = await db.product.update({
      where: { id },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        stockAlert: stockAlertValue,
        stock: stockValue,
        units: {
          deleteMany: {},
          create: data.units.map((unit: any) => ({
            name: unit.name,
            conversion: Number(unit.conversion) || 1,
            price: Number(unit.price) || 0,
            // --- HARGA MODAL DIUPDATE DI SINI ---
            buyPrice: Number(unit.buyPrice) || 0,
          })),
        },
      },
      include: { units: true }, // Sertakan units dalam hasil agar bisa dicek log-nya
    });

    // 2. LOG UNTUK VERIFIKASI (Cek di terminal VS Code)
    console.log("✅ DATA BERHASIL DISIMPAN:", {
      nama: result.name,
      stok: result.stock,
      satuan: result.units.map((u) => ({ nama: u.name, modal: u.buyPrice })),
    });

    revalidatePath("/", "layout");
    return {
      success: true,
      message: "Barang & Harga Modal berhasil diperbarui!",
    };
  } catch (error) {
    console.error("❌ ERROR SAAT UPDATE:", error);
    return { success: false, message: "Gagal memperbarui data ke database." };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    return { success: true, message: "Barang berhasil dihapus!" };
  } catch (error) {
    console.error("Gagal hapus barang:", error);
    return { success: false, message: "Gagal menghapus barang dari database." };
  }
}
