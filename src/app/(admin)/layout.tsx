import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar tetap fixed, diatur internalnya agar sembunyi di HP */}
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 w-full transition-all duration-300 md:ml-64">
        {/* md:ml-64 artinya: 
           - Di HP: Margin 0 (konten penuh se-layar)
           - Di Laptop (md): Margin kiri 64 (memberi ruang untuk sidebar)
        */}
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
