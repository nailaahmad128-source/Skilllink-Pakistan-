import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/authGuard";
import { EMPLOYER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Employer Dashboard" };

export default async function EmployerDashboard() {
  const { user, profile, supabase } = await requireRole(["employer"]);
  const { data: employer } = await supabase.from("employer_profiles").select("*").eq("id", user.id).single();

  const [{ count: activeJobs }, { count: pendingJobs }, { count: totalApplications }] = await Promise.all([
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("employer_id", user.id).eq("status", "approved"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("employer_id", user.id).eq("status", "pending"),
    supabase.from("applications").select("*, jobs!inner(employer_id)", { count: "exact", head: true }).eq("jobs.employer_id", user.id),
  ]);

  let banner = null;
  if (employer?.verification_status === "pending") {
    banner = (
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 mb-4">
        <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold">⏳ Your employer account is pending admin verification.</p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">You'll be able to post jobs once approved — this usually takes 12–24 hours.</p>
      </div>
    );
  } else if (employer?.verification_status === "rejected") {
    banner = (
      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-2xl p-4 mb-4">
        <p className="text-sm text-red-800 dark:text-red-300 font-semibold">❌ Your verification was rejected.</p>
        {employer.rejection_reason && <p className="text-xs text-red-700 dark:text-red-400 mt-1">Reason: {employer.rejection_reason}</p>}
        <Link href="/dashboard/employer/profile" className="text-xs font-bold underline text-red-700 dark:text-red-300 mt-2 inline-block">Update your company profile →</Link>
      </div>
    );
  }

  return (
    <DashboardShell title={`Welcome, ${employer?.company_name || profile.full_name}`} subtitle="Manage your jobs and applications" tabs={EMPLOYER_TABS} banner={banner}>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: "💼", val: activeJobs || 0, label: "Active Jobs" },
          { icon: "⏳", val: pendingJobs || 0, label: "Pending Approval" },
          { icon: "📥", val: totalApplications || 0, label: "Total Applications" },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black text-green-700">{s.val}</div>
            <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center">
        {employer?.verification_status === "approved" ? (
          <>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Ready to find your next great hire?</p>
            <Link href="/dashboard/employer/jobs/new" className="inline-block px-6 py-3 rounded-xl font-bold text-white text-sm" style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}>
              + Post a New Job
            </Link>
          </>
        ) : (
          <p className="text-gray-400 text-sm">Job posting will be available once your account is verified.</p>
        )}
      </div>
    </DashboardShell>
  );
}
