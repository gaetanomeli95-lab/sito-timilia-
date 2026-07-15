import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  const bypassCookie = request.cookies.get("maintenance_bypass")?.value;
  const pathname = request.nextUrl.pathname;

  // Allow access to admin, API routes, Next.js internals, and maintenance page always
  const allowedPaths = ["/admin", "/api", "/_next", "/favicon.ico", "/maintenance"];
  if (allowedPaths.some((p) => pathname.startsWith(p)) || pathname === "/maintenance") {
    return NextResponse.next();
  }

  // Allow bypass if cookie is set (admin)
  if (bypassCookie === "true") {
    return NextResponse.next();
  }

  // Check maintenance mode from Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "maintenance_mode")
      .single();

    if (data?.value === "true") {
      return NextResponse.rewrite(new URL("/maintenance", request.url));
    }
  } catch {
    // If error, allow access (fail open)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
