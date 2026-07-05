import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/authGuard";
import { SEEKER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Job Seeker Dashboard" };

export default async function SeekerDashboard() {
  const { user, profile, supabase } = await requireRole(["seeker"]);

  const [{ count: applied }, { count: shortlisted }, { count: saved }, { data: seekerProfile }] = await Promise.all([
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("seeker_id", user.id),
    supabase.from("applications").select("*", { count: "exact", head: true }).eq("seeker_id", user.id).eq("status", "shortlisted"),
    supabase.from("saved_jobs").select("*", { count: "exact", head: true }).eq("seeker_id", user.id),
    supabase.from("seeker_profiles").select("*").eq("id", user.id).single(),
  ]);

  const { data: recentApplications } = await supabase
    .from("applications")
    .select("*, jobs(title, city, employer_profiles(company_name))")
    .eq("seeker_id", user.id)
    .order("applied_at", { ascending: false })
    .limit(5);

  const profileComplete = seekerProfile?.headline && seekerProfile?.cv_url && seekerProfile?.city;

  return (
    <DashboardShell title={`Welcome back, ${profile.full_name.split(" ")[0]}`} subtitle="Here's what's happening with your job search" tabs={SEEKER_TABS}>
      {!profileComplete && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold">⚠️ Your profile is incomplete. Complete it to get noticed by employers.</p>
          <Link href="/dashboard/seeker/profile" className="text-xs font-bold px-4 py-2 rounded-lg bg-amber-600 text-white">Complete Profile</Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: "📋", val: applied || 0, label: "Total Applications" },
          { icon: "🌟", val: shortlisted || 0, label: "Shortlisted" },
          { icon: "⭐", val: saved || 0, label: "Saved Jobs" },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black text-green-700">{s.val}</div>
            <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Recent Applications</h3>
          <Link href="/dashboard/seeker/applications" className="text-xs font-semibold text-green-600 hover:underline">View all →</Link>
        </div>
        {!recentApplications?.length ? (
          <p className="text-gray-400 text-sm text-center py-6">You haven't applied to any jobs yet. <Link href="/jobs" className="text-green-600 font-semibold">Browse jobs →</Link></p>
        ) : (
          <div className="space-y-3">
            {recentApplications.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{a.jobs?.title}</div>
                  <div className="text-xs text-gray-400">{a.jobs?.employer_profiles?.company_name} · {a.jobs?.city}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function StatusBadge({ status }) {
  const styles = {
    applied: "bg-blue-100 text-blue-700",
    reviewed: "bg-amber-100 text-amber-700",
    shortlisted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    hired: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${styles[status]}`}>{status}</span>;
}
