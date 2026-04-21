"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ProductFormValues } from "@/lib/validations/product";
import { supabase } from "@/lib/supabase";

/**
 * ==========================================
 * 1. FUNGSI TAMBAH BARANG (CREATE)
 * ==========================================
 */
export async function createProductAction(data: ProductFormValues) {
  try {
    await db.product.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        stockAlert: data.stockAlert,
        units: {
          create: data.units.map((unit) => ({
            name: unit.name,
            conversion: unit.conversion,
            price: unit.price,
          })),
        },
      },
    });

    revalidatePath("/inventory");
    return { success: true, message: "Barang berhasil ditambahkan!" };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan data barang baru.",
    };
  }
}

/**
 * ==========================================
 * 2. FUNGSI EDIT BARANG (UPDATE)
 * ==========================================
 */
export async function updateProductAction(id: string, data: ProductFormValues) {
  try {
    await db.product.update({
      where: { id: id },
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        stockAlert: data.stockAlert,
        units: {
          deleteMany: {},
          create: data.units.map((unit) => ({
            name: unit.name,
            conversion: unit.conversion,
            price: unit.price,
          })),
        },
      },
    });

    revalidatePath("/inventory");
    revalidatePath(`/inventory/edit/${id}`);

    return { success: true, message: "Perubahan barang berhasil disimpan!" };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Gagal memperbarui data. Pastikan koneksi stabil.",
    };
  }
}

/**
 * ==========================================
 * 3. FUNGSI HAPUS BARANG (DELETE) + CLEANUP STORAGE
 * ==========================================
 */
export async function deleteProductAction(id: string) {
  try {
    // 1. Cari data barang
    const product = await db.product.findUnique({
      where: { id: id },
      select: { imageUrl: true },
    });

    // 2. Proses Hapus Foto
    if (product?.imageUrl) {
      const bucketName = "products";

      // Ambil bagian setelah '/products/'
      const parts = product.imageUrl.split(`${bucketName}/`);

      if (parts.length > 1) {
        // Hilangkan parameter query (?t=...)
        const rawPath = parts[1].split("?")[0];

        // Decoding URL (penting jika nama file ada spasi/karakter khusus)
        // Contoh: 'product%20images/foto.jpg' menjadi 'product images/foto.jpg'
        const filePath = decodeURIComponent(rawPath);

        console.log("DEBUG: Menghapus file dari bucket:", bucketName);
        console.log("DEBUG: Path file murni:", filePath);

        const { data, error: storageError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);

        if (storageError) {
          console.error("DEBUG ERROR STORAGE:", storageError.message);
        } else if (data && data.length === 0) {
          console.warn(
            "DEBUG WARNING: Perintah hapus jalan, tapi file tidak ditemukan di storage.",
          );
        } else {
          console.log("DEBUG SUCCESS: File berhasil dihapus!");
        }
      }
    }

    // 3. Hapus Data di Database
    await db.unit.deleteMany({ where: { productId: id } });
    await db.product.delete({ where: { id: id } });

    revalidatePath("/inventory");
    return { success: true, message: "Barang dan foto berhasil dibersihkan!" };
  } catch (error) {
    console.error("Error utama:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}
