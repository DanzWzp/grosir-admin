"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImagePlus, Loader2, X } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadStart: () => void;
}

export default function ImageUpload({
  onUploadSuccess,
  onUploadStart,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // --- LOGIKA PREVIEW ---
    // Ini yang membuat gambar muncul di layar segera setelah dipilih
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setUploading(true);
    onUploadStart();

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Unggah ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Ambil Public URL setelah berhasil upload
      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      onUploadSuccess(data.publicUrl);
    } catch (error) {
      alert("Gagal mengunggah gambar!");
      console.error(error);
      setPreview(null); // Reset preview jika gagal
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setPreview(null);
    onUploadSuccess(""); // Kosongkan URL di form utama
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">
        Foto Barang
      </label>

      {/* Container Box */}
      <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group h-52 overflow-hidden">
        {preview ? (
          <>
            {/* Gambar yang ditampilkan setelah dipilih */}
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay saat kursor di atas gambar */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium">
                Klik untuk Ganti Foto
              </p>
            </div>

            {/* Tombol X untuk membatalkan foto */}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10 shadow-lg"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          /* Tampilan saat foto belum dipilih atau sedang proses upload */
          <div className="flex flex-col items-center gap-2 text-slate-400">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-blue-600">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-xs font-bold italic">
                  Sedang Mengunggah...
                </span>
              </div>
            ) : (
              <>
                <ImagePlus size={40} strokeWidth={1.5} />
                <div className="text-center">
                  <span className="text-sm font-semibold block text-slate-600">
                    Pilih Foto Barang
                  </span>
                  <span className="text-[10px] text-slate-400">
                    PNG, JPG (Maks 5MB)
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Input file asli yang disembunyikan tapi tetap bisa diklik */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer z-0"
        />
      </div>
    </div>
  );
}
