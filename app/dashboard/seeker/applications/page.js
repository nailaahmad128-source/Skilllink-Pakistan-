import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import WithdrawButton from "@/components/dashboard/WithdrawButton";
import { requireRole } from "@/lib/authGuard";
import { SEEKER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "My Applications" };

const STATUS_STYLES = {
  applied: "bg-blue-100 text-blue-700",
  reviewed: "bg-amber-100 text-amber-700",
  shortlisted: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-emerald-100 text-emerald-700",
};

export default async function SeekerApplicationsPage() {
  const { user, supabase } = await requireRole(["seeker"]);
  const { data: applications } = await supabase
    .from("applications")
    .select("*, jobs(id, title, city, job_type, employer_profiles(company_name))")
    .eq("seeker_id", user.id)
    .order("applied_at", { ascending: false });

  return (
    <DashboardShell title="My Applications" subtitle="Track the status of every job you've applied to" tabs={SEEKER_TABS}>
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {!applications?.length ? (
          <p className="text-center text-gray-400 py-12">
            No applications yet. <Link href="/jobs" className="text-green-600 font-semibold">Browse jobs →</Link>
          </p>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-900">
            {applications.map((a) => (
              <div key={a.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <Link href={`/jobs/${a.jobs?.id}`} className="font-bold text-gray-900 dark:text-white text-sm hover:text-green-600">
                    {a.jobs?.title}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.jobs?.employer_profiles?.company_name} · {a.jobs?.city} · Applied {new Date(a.applied_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${STATUS_STYLES[a.status]}`}>{a.status}</span>
                  {a.status === "applied" && <WithdrawButton applicationId={a.id} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
