import { NextRequest } from "next/server";
import { createClient, type User } from "@supabase/supabase-js";

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
