import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getSupabaseEnv, MISSING_ENV_MESSAGE } from "./env";

// Refreshes the Supabase auth session on every request so cookies never go stale.
export async function updateSession(request) {
  let response = NextResponse.next({ request });

  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    // Don't let a missing/misconfigured Supabase project take down every
    // route in the app (the middleware matcher runs on almost every path).
    // Log it server-side and let the request through unauthenticated.
    console.error(`[supabase/middleware] ${MISSING_ENV_MESSAGE}`);
    return response;
  }

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    // Touch the session so it refreshes if expired.
    await supabase.auth.getUser();
  } catch (err) {
    // Defense in depth: a malformed URL/key can still throw even when
    // isConfigured is true. Never let that take down every request.
    console.error(`[supabase/middleware] ${err?.message || err}`);
  }

  return response;
}
