import DashboardShell from "@/components/dashboard/DashboardShell";
import SeekerProfileForm from "@/components/dashboard/SeekerProfileForm";
import { requireRole } from "@/lib/authGuard";
import { SEEKER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "My Profile" };

export default async function SeekerProfilePage() {
  const { user, profile, supabase } = await requireRole(["seeker"]);
  const { data: seekerProfile } = await supabase.from("seeker_profiles").select("*").eq("id", user.id).single();

  return (
    <DashboardShell title="My Profile" subtitle="Keep your profile updated to attract the right employers" tabs={SEEKER_TABS}>
      <SeekerProfileForm userId={user.id} initialProfile={seekerProfile} initialAccount={profile} />
    </DashboardShell>
  );
}
