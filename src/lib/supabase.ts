import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase server environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

/**
 * Keep the existing supabaseAdmin API while delaying client creation until
 * an API handler actually accesses it. This prevents Next.js/Vercel builds
 * from failing while collecting route metadata when Preview env vars are
 * intentionally unavailable.
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    const client = getSupabaseAdminClient();
    const value = Reflect.get(client, property, receiver);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
