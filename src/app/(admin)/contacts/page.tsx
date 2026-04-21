import {
  MessageCircle,
  Mail,
  ShieldCheck,
  Code2,
  ExternalLink,
  Smartphone,
} from "lucide-react";

export default function ContactsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 mb-4">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
          Pusat Bantuan Developer
        </h1>
        <p className="text-slate-500 max-w-md mx-auto">
          Mengalami kendala sistem atau butuh update fitur? Hubungi Fitrah
          sebagai pengembang aplikasi SalhaShop.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jalur WhatsApp */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-green-400 transition-all group">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-500 group-hover:text-white transition-all">
                <MessageCircle size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  WhatsApp Support
                </h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                  Respon Cepat
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Gunakan jalur ini untuk perbaikan bug mendesak, error database,
              atau bantuan teknis saat operasional toko.
            </p>

            <a
              href="https://wa.me/6285657075953?text=Halo%20Fitrah,%20saya%20butuh%20bantuan%20terkait%20sistem%20SalhaShop"
              target="_blank"
              className="mt-auto flex items-center justify-center gap-3 py-4 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-100"
            >
              <Smartphone size={18} />
              Chat WhatsApp
              <ExternalLink size={14} className="opacity-50" />
            </a>
          </div>
        </div>

        {/* Jalur Email */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all group">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  Email Developer
                </h3>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                  Bantuan Teknis
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Kirimkan detail permasalahan atau permintaan fitur baru melalui
              email untuk dokumentasi yang lebih rapi.
            </p>

            <a
              href="mailto:fitrahikaya@gmail.com?subject=Bantuan%20Teknis%20SalhaShop"
              className="mt-auto flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <Mail size={18} />
              Kirim Email
              <ExternalLink size={14} className="opacity-50" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <footer className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Code2 size={20} className="text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">
              Versi Aplikasi 1.0.0
            </p>
            <p className="text-xs text-slate-400 italic">
              Built with Next.js, Prisma, & Supabase
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center md:text-right">
          © 2026 SalhaShop Inventory System
        </p>
      </footer>
    </div>
  );
}
