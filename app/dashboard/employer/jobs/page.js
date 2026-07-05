import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import JobRowActions from "@/components/dashboard/JobRowActions";
import { Badge } from "@/components/ui/Primitives";
import { requireRole } from "@/lib/authGuard";
import { EMPLOYER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "My Jobs" };

const STATUS_STYLES = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function EmployerJobsPage() {
  const { user, supabase } = await requireRole(["employer"]);
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, categories(label, icon)")
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardShell title="My Jobs" subtitle="Manage all your job postings" tabs={EMPLOYER_TABS}>
      <div className="flex justify-end">
        <Link href="/dashboard/employer/jobs/new" className="px-4 py-2 rounded-xl font-bold text-white text-sm" style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}>
          + Post a Job
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {!jobs?.length ? (
          <p className="text-center text-gray-400 py-12">You haven't posted any jobs yet.</p>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-900">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white text-sm">{job.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{job.city} · {job.job_type} · Posted {new Date(job.created_at).toLocaleDateString()}</div>
                  {job.status === "rejected" && job.rejection_reason && (
                    <div className="text-xs text-red-600 mt-1">Rejected: {job.rejection_reason}</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${STATUS_STYLES[job.status]}`}>{job.status}</span>
                  <JobRowActions jobId={job.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
