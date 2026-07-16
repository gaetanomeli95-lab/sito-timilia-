import { NextRequest } from "next/server";
import { createClient, type User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) return null;

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user }, error } = await client.auth.getUser(token);

  return error ? null : user;
}

export async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const user = await getAuthenticatedUser(request);
  if (!user) return false;

  const { data: profile } = await supabaseAdmin
    .from("customers")
    .select("is_admin")
    .eq("auth_id", user.id)
    .limit(1);

  if (!profile || profile.length === 0) return false;

  return profile[0].is_admin === true;
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  request: NextRequest,
  maxRequests: number = 10,
  windowMs: number = 60_000
): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= maxRequests;
}
