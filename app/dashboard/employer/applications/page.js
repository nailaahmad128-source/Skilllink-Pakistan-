import DashboardShell from "@/components/dashboard/DashboardShell";
import ApplicationStatusControl from "@/components/dashboard/ApplicationStatusControl";
import CvDownloadLink from "@/components/dashboard/CvDownloadLink";
import { Avatar } from "@/components/ui/Primitives";
import { requireRole } from "@/lib/authGuard";
import { EMPLOYER_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Applications" };

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default async function EmployerApplicationsPage() {
  const { user, supabase } = await requireRole(["employer"]);

  const { data: applications } = await supabase
    .from("applications")
    .select("*, jobs!inner(id, title, employer_id), profiles:seeker_id(full_name, phone), seeker_profiles:seeker_id(headline, city, cv_url, cv_filename)")
    .eq("jobs.employer_id", user.id)
    .order("applied_at", { ascending: false });

  return (
    <DashboardShell title="Applications" subtitle="Review and manage candidates who applied to your jobs" tabs={EMPLOYER_TABS}>
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {!applications?.length ? (
          <p className="text-center text-gray-400 py-12">No applications yet.</p>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-900">
            {applications.map((a) => (
              <div key={a.id} className="p-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 min-w-0">
                  <Avatar initials={initials(a.profiles?.full_name)} size="sm" />
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{a.profiles?.full_name}</div>
                    <div className="text-xs text-gray-400">
                      Applied for <span className="font-semibold text-gray-600 dark:text-gray-300">{a.jobs?.title}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {a.seeker_profiles?.headline} {a.seeker_profiles?.city ? `· ${a.seeker_profiles.city}` : ""} {a.profiles?.phone ? `· ${a.profiles.phone}` : ""}
                    </div>
                    {a.cover_letter && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic max-w-md">"{a.cover_letter}"</p>}
                    <div className="mt-2">
                      <CvDownloadLink cvPath={a.cv_url_snapshot || a.seeker_profiles?.cv_url} />
                    </div>
                  </div>
                </div>
                <ApplicationStatusControl applicationId={a.id} currentStatus={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
