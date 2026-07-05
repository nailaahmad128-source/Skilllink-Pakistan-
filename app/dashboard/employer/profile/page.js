import DashboardShell from "@/components/dashboard/DashboardShell";
import EmployerProfileForm from "@/components/dashboard/EmployerProfileForm";
import { requireRole } from "@/lib/authGuard";
import { EMPLOYER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Company Profile" };

export default async function EmployerProfilePage() {
  const { user, supabase } = await requireRole(["employer"]);
  const { data: employer } = await supabase.from("employer_profiles").select("*").eq("id", user.id).single();

  return (
    <DashboardShell title="Company Profile" subtitle="This information is shown to job seekers on your job listings" tabs={EMPLOYER_TABS}>
      <EmployerProfileForm userId={user.id} initialEmployer={employer} />
    </DashboardShell>
  );
}
