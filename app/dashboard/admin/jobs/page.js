import DashboardShell from "@/components/dashboard/DashboardShell";
import JobApprovalRow from "@/components/dashboard/admin/JobApprovalRow";
import { requireRole } from "@/lib/authGuard";
import { ADMIN_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Manage Jobs" };

const STATUS_STYLES = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function AdminJobsPage({ searchParams }) {
  const { supabase } = await requireRole(["admin"]);
  const filter = searchParams?.status || "pending";

  let query = supabase.from("jobs").select("*, employer_profiles(company_name), categories(label)").order("created_at", { ascending: false });
  if (filter !== "all") query = query.eq("status", filter);
  const { data: jobs } = await query;

  return (
    <DashboardShell title="Manage Jobs" subtitle="Approve, reject, or review job postings" tabs={ADMIN_TABS}>
      <div className="flex gap-2 flex-wrap">
        {[["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["all", "All"]].map(([val, label]) => (
          <a
            key={val}
            href={`/dashboard/admin/jobs?status=${val}`}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === val ? "bg-green-600 text-white" : "bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        {!jobs?.length ? (
          <p className="text-center text-gray-400 py-8">No jobs in this category.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) =>
              job.status === "pending" ? (
                <JobApprovalRow key={job.id} job={job} />
              ) : (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 flex-wrap gap-2">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{job.title}</div>
                    <div className="text-xs text-gray-400">{job.employer_profiles?.company_name} · {job.categories?.label || "Uncategorized"} · {job.city}</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${STATUS_STYLES[job.status]}`}>{job.status}</span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
