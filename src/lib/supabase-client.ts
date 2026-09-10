import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

const missingConfigError = {
  message: "Autenticazione non disponibile in questa preview.",
};

function createPreviewFallbackClient(): SupabaseClient {
  const subscription = { unsubscribe() {} };

  const auth = {
    async getSession() {
      return { data: { session: null }, error: null };
    },
    onAuthStateChange() {
      return { data: { subscription } };
    },
    async signOut() {
      return { error: null };
    },
    async signUp() {
      return { data: { user: null, session: null }, error: missingConfigError };
    },
    async signInWithPassword() {
      return { data: { user: null, session: null }, error: missingConfigError };
    },
    async resend() {
      return { data: {}, error: missingConfigError };
    },
  };

  const makeQuery = () => {
    const result = Promise.resolve({ data: null, error: missingConfigError });
    const query: Record<string, unknown> = {
      select: () => query,
      insert: () => query,
      update: () => query,
      delete: () => query,
      eq: () => query,
      neq: () => query,
      order: () => query,
      limit: () => query,
      single: () => result,
      maybeSingle: () => result,
      then: result.then.bind(result),
      catch: result.catch.bind(result),
      finally: result.finally.bind(result),
    };
    return query;
  };

  return {
    auth,
    from: () => makeQuery(),
  } as unknown as SupabaseClient;
}

function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    browserClient = createPreviewFallbackClient();
    return browserClient;
  }

  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "timilia_auth",
    },
  });

  return browserClient;
}

/**
 * Production uses the real Supabase client. Preview deployments without the
 * public Supabase variables receive a neutral fallback instead of throwing at
 * runtime, so visual experiments remain testable without affecting main.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getSupabaseBrowserClient();
    const value = Reflect.get(client, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
