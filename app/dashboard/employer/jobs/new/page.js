import DashboardShell from "@/components/dashboard/DashboardShell";
import JobForm from "@/components/dashboard/JobForm";
import { requireRole } from "@/lib/authGuard";
import { EMPLOYER_TABS } from "@/lib/dashboardTabs";
import { redirect } from "next/navigation";

export const metadata = { title: "Post a Job" };

export default async function NewJobPage() {
  const { user, supabase } = await requireRole(["employer"]);
  const { data: employer } = await supabase.from("employer_profiles").select("verification_status").eq("id", user.id).single();

  if (employer?.verification_status !== "approved") redirect("/dashboard/employer");

  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <DashboardShell title="Post a New Job" subtitle="Fill in the details below — your job will be reviewed before publishing" tabs={EMPLOYER_TABS}>
      <JobForm employerId={user.id} categories={categories || []} />
    </DashboardShell>
  );
}
