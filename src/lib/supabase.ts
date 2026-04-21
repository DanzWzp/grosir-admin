import { createBrowserClient } from "@supabase/ssr";

// Gunakan createBrowserClient agar sinkron dengan Middleware Next.js
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
