import DashboardShell from "@/components/dashboard/DashboardShell";
import EmployerApprovalRow from "@/components/dashboard/admin/EmployerApprovalRow";
import { requireRole } from "@/lib/authGuard";
import { ADMIN_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Manage Employers" };

const STATUS_STYLES = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default async function AdminEmployersPage({ searchParams }) {
  const { supabase } = await requireRole(["admin"]);
  const filter = searchParams?.status || "pending";

  let query = supabase.from("employer_profiles").select("*").order("created_at", { ascending: false });
  if (filter !== "all") query = query.eq("verification_status", filter);
  const { data: employers } = await query;

  return (
    <DashboardShell title="Manage Employers" subtitle="Approve, reject, or review employer accounts" tabs={ADMIN_TABS}>
      <div className="flex gap-2 flex-wrap">
        {[["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["all", "All"]].map(([val, label]) => (
          <a
            key={val}
            href={`/dashboard/admin/employers?status=${val}`}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === val ? "bg-green-600 text-white" : "bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        {!employers?.length ? (
          <p className="text-center text-gray-400 py-8">No employers in this category.</p>
        ) : (
          <div className="space-y-3">
            {employers.map((emp) =>
              emp.verification_status === "pending" ? (
                <EmployerApprovalRow key={emp.id} employer={emp} />
              ) : (
                <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 flex-wrap gap-2">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{emp.company_name}</div>
                    <div className="text-xs text-gray-400">{emp.industry || "—"} · {emp.city || "—"}</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${STATUS_STYLES[emp.verification_status]}`}>
                    {emp.verification_status}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
