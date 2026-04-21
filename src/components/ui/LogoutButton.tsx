"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      window.location.replace("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleLogout}
      isLoading={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-slate-800 text-red-400 hover:bg-slate-700 hover:text-red-300 border border-slate-700 shadow-none transition-all duration-200"
    >
      <LogOut size={18} />
      <span className="font-medium">Keluar</span>
    </Button>
  );
}
