"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Save, CheckCircle2 } from "lucide-react";
// Import schema dan type yang sudah kita bahas sebelumnya
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import { Button } from "./ui/Button";
import {
  createProductAction,
  updateProductAction,
} from "@/app/actions/products";
import ImageUpload from "./ImageUpload";

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadKey, setUploadKey] = useState(Date.now());
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    // PERBAIKAN: Menambahkan casting <any> pada resolver adalah "jalan ninja" tercepat
    // jika TS masih bingung mencocokkan tipe data internal Zod
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          imageUrl: initialData.imageUrl || undefined,
          stockAlert: initialData.stockAlert,
          stock: initialData.stock,
          units: initialData.units,
        }
      : {
          name: "",
          imageUrl: undefined,
          stockAlert: 5,
          stock: 0,
          units: [{ name: "Pcs", conversion: 1, buyPrice: 0, price: 0 }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "units",
  });

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setIsSubmitting(true);
    setMessage(null);

    let result;
    if (initialData) {
      result = await updateProductAction(initialData.id, data);
    } else {
      result = await createProductAction(data);
    }

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      if (!initialData) {
        reset();
        setUploadKey(Date.now());
      }
    } else {
      setMessage({ type: "error", text: result.message });
    }

    setIsSubmitting(false);
  };

  if (!mounted) return null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200"
    >
      {/* ... bagian notifikasi dan input lainnya tetap sama seperti kode Anda ... */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" && <CheckCircle2 size={20} />}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ImageUpload
            key={uploadKey}
            onUploadStart={() => setIsSubmitting(true)}
            onUploadSuccess={(url) => {
              setValue("imageUrl", url);
              setIsSubmitting(false);
            }}
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-slate-700">
              Nama Barang
            </label>
            <input
              {...register("name")}
              disabled={isSubmitting}
              className="border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 transition-all"
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">
                Stok Saat Ini
              </label>
              <input
                type="number"
                {...register("stock")}
                disabled={isSubmitting}
                className="border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700">
                Batas Stok Menipis
              </label>
              <input
                type="number"
                {...register("stockAlert")}
                disabled={isSubmitting}
                className="border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Manajemen Satuan</h3>
          <Button
            type="button"
            variant="outline"
            size="sm" // Sekarang size="sm" sudah aman karena Button.tsx sudah kita perbaiki tadi
            onClick={() =>
              append({ name: "", conversion: 1, buyPrice: 0, price: 0 })
            }
            disabled={isSubmitting}
          >
            <Plus size={14} /> Tambah Satuan
          </Button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl items-end border border-slate-100"
            >
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500">
                  Nama Satuan
                </label>
                <input
                  {...register(`units.${index}.name`)}
                  className="border border-slate-200 p-2 rounded-lg text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500">
                  Isi (Konversi)
                </label>
                <input
                  type="number"
                  {...register(`units.${index}.conversion`)}
                  className="border border-slate-200 p-2 rounded-lg text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-blue-600">
                  Harga Modal (Rp)
                </label>
                <input
                  type="number"
                  {...register(`units.${index}.buyPrice`)}
                  className="border border-blue-100 p-2 rounded-lg text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-green-600">
                  Harga Jual (Rp)
                </label>
                <input
                  type="number"
                  {...register(`units.${index}.price`)}
                  className="border border-green-100 p-2 rounded-lg text-sm font-medium"
                />
              </div>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => remove(index)}
                disabled={isSubmitting}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        className="w-full h-12 text-lg font-bold"
      >
        <Save size={20} className="mr-2" />
        {initialData ? "Perbarui Data Barang" : "Simpan Data Barang"}
      </Button>
    </form>
  );
}
