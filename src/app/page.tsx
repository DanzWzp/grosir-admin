import { redirect } from "next/navigation";

export default function RootPage() {
  // Jika ada orang yang membuka localhost:3000,
  // langsung tendang mereka ke halaman /login
  redirect("/login");
}
