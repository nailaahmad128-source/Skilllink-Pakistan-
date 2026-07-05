import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv, MISSING_ENV_MESSAGE, createStubSupabaseClient } from "./env";

// Use inside Server Components, Route Handlers, and Server Actions.
export function createClient() {
  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    // Missing env vars: log loudly on the server (visible in Vercel function
    // logs) but return a stub instead of throwing, so a single misconfigured
    // deployment doesn't 500 every page that touches Supabase.
    console.error(`[supabase/server] ${MISSING_ENV_MESSAGE}`);
    return createStubSupabaseClient();
  }

  const cookieStore = cookies();

  try {
    return createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component with no write access — safe to ignore
            // because middleware handles session refresh.
          }
        },
      },
    });
  } catch (err) {
    // Defense in depth: a malformed URL/key can still throw even when
    // isConfigured is true. Never let that take down a prerender/build.
    console.error(`[supabase/server] ${err?.message || err}`);
    return createStubSupabaseClient();
  }
}
