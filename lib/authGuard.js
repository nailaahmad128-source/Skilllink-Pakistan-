import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Use at the top of any Server Component page that needs auth + role gating.
export async function requireRole(allowedRoles) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile || !allowedRoles.includes(profile.role)) redirect("/");

  return { user, profile, supabase };
}
