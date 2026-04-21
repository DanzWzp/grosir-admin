import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama barang minimal 3 karakter"),
  imageUrl: z.string().optional(),

  stockAlert: z.coerce.number().min(0, "Peringatan stok tidak boleh negatif"),

  // 👉 INI TERSANGKANYA: Pastikan baris ini ADA dan persis seperti ini!
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),

  units: z
    .array(
      z.object({
        name: z.string().min(1, "Nama satuan harus diisi"),
        conversion: z.coerce.number().min(1, "Konversi minimal 1"),
        price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
        buyPrice: z.coerce.number().min(0, "Harga modal tidak boleh negatif"),
      }),
    )
    .min(1, "Minimal harus ada satu satuan"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
