import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/authGuard";
import { ADMIN_TABS } from "@/lib/dashboardTabs";
import JobApprovalRow from "@/components/dashboard/admin/JobApprovalRow";
import EmployerApprovalRow from "@/components/dashboard/admin/EmployerApprovalRow";

export const metadata = { title: "Admin Panel" };

export default async function AdminDashboard() {
  const { supabase } = await requireRole(["admin"]);

  const [
    { count: activeJobs },
    { count: totalUsers },
    { count: totalEmployers },
    { count: pendingJobsCount },
    { count: pendingEmployersCount },
  ] = await Promise.all([
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("employer_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "approved"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("employer_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
  ]);

  const [{ data: pendingJobs }, { data: pendingEmployers }, { data: recentUsers }] = await Promise.all([
    supabase.from("jobs").select("*, employer_profiles(company_name), categories(label)").eq("status", "pending").order("created_at", { ascending: false }).limit(5),
    supabase.from("employer_profiles").select("*").eq("verification_status", "pending").order("created_at", { ascending: false }).limit(5),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { icon: "💼", val: (activeJobs || 0).toLocaleString(), label: "Active Jobs", col: "text-green-700" },
    { icon: "👥", val: (totalUsers || 0).toLocaleString(), label: "Total Users", col: "text-blue-700" },
    { icon: "🏢", val: (totalEmployers || 0).toLocaleString(), label: "Verified Employers", col: "text-amber-600" },
    { icon: "⏳", val: (pendingJobsCount || 0) + (pendingEmployersCount || 0), label: "Pending Approval", col: "text-red-600" },
  ];

  return (
    <DashboardShell title="Admin Panel" subtitle="SkillLink Pakistan — Management Dashboard" tabs={ADMIN_TABS}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-2xl font-black ${s.col}`}>{s.val}</div>
            <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">⏳ Jobs Pending Approval</h3>
          <Link href="/dashboard/admin/jobs" className="text-xs font-semibold text-green-600 hover:underline">View all →</Link>
        </div>
        {!pendingJobs?.length ? (
          <p className="text-gray-400 text-sm text-center py-4">No jobs waiting for review.</p>
        ) : (
          <div className="space-y-3">
            {pendingJobs.map((job) => <JobApprovalRow key={job.id} job={job} />)}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">🏢 Employers Pending Verification</h3>
          <Link href="/dashboard/admin/employers" className="text-xs font-semibold text-green-600 hover:underline">View all →</Link>
        </div>
        {!pendingEmployers?.length ? (
          <p className="text-gray-400 text-sm text-center py-4">No employers waiting for review.</p>
        ) : (
          <div className="space-y-3">
            {pendingEmployers.map((emp) => <EmployerApprovalRow key={emp.id} employer={emp} />)}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">👥 Recent Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <th className="text-left pb-2 font-semibold">Name</th>
                <th className="text-left pb-2 font-semibold">Role</th>
                <th className="text-left pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
              {(recentUsers || []).map((u) => (
                <tr key={u.id}>
                  <td className="py-2.5 font-semibold text-gray-800 dark:text-gray-200">{u.full_name}</td>
                  <td className="py-2.5 text-gray-500 capitalize">{u.role}</td>
                  <td className="py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${u.account_status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {u.account_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
