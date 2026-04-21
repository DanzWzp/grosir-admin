import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // Ambil sesi user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = request.nextUrl.pathname;

  // Tentukan rute mana saja yang masuk kategori "Admin/Proteksi"
  // Kita cek apakah path diawali dengan salah satu rute di bawah
  const protectedRoutes = [
    "/dashboard",
    "/inventory",
    "/transactions",
    "/finance",
    "/contacts",
    "/",
  ];
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(route + "/"),
  );

  const isLoginPage = path.startsWith("/login");

  // 1. Jika BELUM login & mencoba akses rute terproteksi -> Tendang ke /login
  if (isProtectedRoute && !session && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Jika SUDAH login & mencoba akses halaman login -> Balikkan ke /dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  // Matcher ditingkatkan agar memantau semua rute utama aplikasi
  matcher: [
    "/",
    "/dashboard/:path*",
    "/inventory/:path*",
    "/transactions/:path*",
    "/finance/:path*",
    "/contacts/:path*",
    "/login",
  ],
};
