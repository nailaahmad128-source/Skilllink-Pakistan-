"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, MISSING_ENV_MESSAGE, createStubSupabaseClient } from "./env";

let client;

// Singleton browser client — safe to import anywhere in client components.
//
// NOTE: this file is rendered on the server too. Client components (e.g.
// AuthModal/AuthContext, which live in the root layout) go through an SSR
// pass for every page, including ones Next tries to statically prerender at
// build time (like the default /404 page). createBrowserClient() throws
// immediately if the URL/key are empty, so without the guard below a
// misconfigured (or not-yet-configured) Supabase project would crash
// `next build` entirely. In the browser we still throw, so a real
// misconfiguration is obvious during development.
export function createClient() {
  if (client) return client;

  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    if (typeof window === "undefined") {
      // Server-side render/build without env vars configured yet — return an
      // inert stub so prerendering can succeed instead of crashing the build.
      return createStubSupabaseClient();
    }
    throw new Error(MISSING_ENV_MESSAGE);
  }

  try {
    client = createBrowserClient(url, anonKey);
  } catch (err) {
    // Defense in depth: even with isConfigured true, a malformed URL/key can
    // still make @supabase/ssr throw. Never let that take down a prerender.
    if (typeof window === "undefined") {
      console.error(`[supabase/client] ${err?.message || err}`);
      return createStubSupabaseClient();
    }
    throw err;
  }
  return client;
}
