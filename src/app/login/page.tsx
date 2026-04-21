"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import {
  LogIn as LoginIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  AlertCircle as AlertIcon,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Proses Login ke Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        },
      );

      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "Email atau password salah!"
            : authError.message,
        );
        setLoading(false);
        return;
      }

      // 2. Jika Login Berhasil
      if (data?.session) {
        // Simpan sesi secara manual sebagai cadangan di browser
        await supabase.auth.setSession(data.session);

        // Beri jeda 500ms agar cookie benar-benar tersimpan sebelum middleware mencegat
        setTimeout(() => {
          window.location.href = "/inventory";
        }, 500);
      } else {
        setLoading(false);
        setError("Sesi gagal dibuat. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Terjadi kesalahan sistem koneksi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
            <LoginIcon size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            SalhaShop Admin
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Masuk untuk mengelola inventaris toko
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in zoom-in-95 duration-300">
              <AlertIcon size={18} className="shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div className="relative">
              <label
                htmlFor="email-field"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1"
              >
                Email
              </label>
              <div className="mt-1 relative">
                <MailIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  id="email-field"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white disabled:opacity-50"
                  placeholder="admin@salhashop.com"
                />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="password-field"
                className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <LockIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  id="password-field"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-4 text-lg rounded-xl shadow-lg shadow-blue-100 transition-transform active:scale-[0.98]"
          >
            Masuk Sekarang
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          &copy; 2026 SalhaShop Digital System
        </p>
      </div>
    </div>
  );
}
