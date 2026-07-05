// Central place to read + validate the Supabase env vars.
//
// Why this exists: @supabase/ssr throws synchronously the moment
// createBrowserClient()/createServerClient() is called with an empty URL or
// key. Several client components (AuthModal, Navbar, AuthContext, etc.) are
// mounted from the root layout, which means they render during `next build`
// while Next tries to statically prerender pages (including the
// auto-generated /404 page). If NEXT_PUBLIC_SUPABASE_URL /
// NEXT_PUBLIC_SUPABASE_ANON_KEY aren't present at build time, that throw
// happens mid-build and takes down the whole `next build` on Vercel with an
// error inside @supabase/ssr.
//
// getSupabaseEnv() lets callers detect this case and fail gracefully on the
// server (so the build/prerender can succeed) while still failing loudly in
// the browser, where a misconfigured project should be obvious immediately.

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isConfigured = Boolean(url && anonKey);

  return { url, anonKey, isConfigured };
}

export const MISSING_ENV_MESSAGE =
  "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and " +
  "NEXT_PUBLIC_SUPABASE_ANON_KEY (Project Settings \u2192 Environment Variables on " +
  "Vercel, or .env.local for local dev). See README.md for the full list.";

// A minimal, inert stand-in for the Supabase client used ONLY on the server
// (SSR/build) when env vars aren't configured yet. It never throws and every
// call resolves to an "empty" result, so pages can prerender without a real
// project connected. Real requests in the browser never use this — see the
// isConfigured checks in client.js/server.js/middleware.js.
export function createStubSupabaseClient() {
  const emptyResult = () => Promise.resolve({ data: null, error: null, count: 0 });

  const queryBuilder = {
    select: () => queryBuilder,
    insert: () => queryBuilder,
    update: () => queryBuilder,
    delete: () => queryBuilder,
    upsert: () => queryBuilder,
    eq: () => queryBuilder,
    neq: () => queryBuilder,
    order: () => queryBuilder,
    limit: () => queryBuilder,
    single: emptyResult,
    maybeSingle: emptyResult,
    then: (resolve) => emptyResult().then(resolve),
  };

  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: () =>
        Promise.resolve({ data: null, error: { message: MISSING_ENV_MESSAGE } }),
      signUp: () => Promise.resolve({ data: null, error: { message: MISSING_ENV_MESSAGE } }),
      signOut: () => Promise.resolve({ error: null }),
      exchangeCodeForSession: () =>
        Promise.resolve({ data: null, error: { message: MISSING_ENV_MESSAGE } }),
      resetPasswordForEmail: () =>
        Promise.resolve({ error: { message: MISSING_ENV_MESSAGE } }),
      updateUser: () => Promise.resolve({ data: null, error: { message: MISSING_ENV_MESSAGE } }),
    },
    from: () => queryBuilder,
  };
}
