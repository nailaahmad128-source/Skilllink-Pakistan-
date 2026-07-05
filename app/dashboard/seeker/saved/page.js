import DashboardShell from "@/components/dashboard/DashboardShell";
import JobsGrid from "@/components/jobs/JobsGrid";
import { requireRole } from "@/lib/authGuard";
import { SEEKER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Saved Jobs" };

export default async function SeekerSavedJobsPage() {
  const { user, supabase } = await requireRole(["seeker"]);
  const { data: saved } = await supabase
    .from("saved_jobs")
    .select("job_id, jobs(*, employer_profiles(company_name, logo_url), categories(label, icon))")
    .eq("seeker_id", user.id)
    .order("created_at", { ascending: false });

  const jobs = (saved || []).map((s) => s.jobs).filter(Boolean);

  return (
    <DashboardShell title="Saved Jobs" subtitle="Jobs you've bookmarked for later" tabs={SEEKER_TABS}>
      <JobsGrid jobs={jobs} />
    </DashboardShell>
  );
}
