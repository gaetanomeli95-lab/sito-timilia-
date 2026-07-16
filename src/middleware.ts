import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

let maintenanceCache: { value: boolean; ts: number } | null = null;
const CACHE_TTL_MS = 30_000;

async function isMaintenanceMode(): Promise<boolean> {
  const now = Date.now();
  if (maintenanceCache && now - maintenanceCache.ts < CACHE_TTL_MS) {
    return maintenanceCache.value;
  }

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

    const value = data?.value === "true";
    maintenanceCache = { value, ts: now };
    return value;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const bypassCookie = request.cookies.get("maintenance_bypass")?.value;
  const pathname = request.nextUrl.pathname;

  const allowedPaths = ["/admin", "/api", "/_next", "/favicon.ico", "/maintenance"];
  if (allowedPaths.some((p) => pathname.startsWith(p)) || pathname === "/maintenance") {
    return NextResponse.next();
  }

  if (bypassCookie === "true") {
    return NextResponse.next();
  }

  if (await isMaintenanceMode()) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
