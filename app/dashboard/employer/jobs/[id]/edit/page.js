import { notFound } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import JobForm from "@/components/dashboard/JobForm";
import { requireRole } from "@/lib/authGuard";
import { EMPLOYER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Edit Job" };

export default async function EditJobPage({ params }) {
  const { user, supabase } = await requireRole(["employer"]);
  const { data: job } = await supabase.from("jobs").select("*").eq("id", params.id).eq("employer_id", user.id).single();
  if (!job) notFound();

  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <DashboardShell title="Edit Job" subtitle="Changes will be re-reviewed by our admin team" tabs={EMPLOYER_TABS}>
      <JobForm employerId={user.id} categories={categories || []} existingJob={job} />
    </DashboardShell>
  );
}
