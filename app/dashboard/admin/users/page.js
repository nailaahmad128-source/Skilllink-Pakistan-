import DashboardShell from "@/components/dashboard/DashboardShell";
import UserStatusControl from "@/components/dashboard/admin/UserStatusControl";
import { requireRole } from "@/lib/authGuard";
import { ADMIN_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Manage Users" };

export default async function AdminUsersPage({ searchParams }) {
  const { supabase } = await requireRole(["admin"]);
  const roleFilter = searchParams?.role || "all";

  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (roleFilter !== "all") query = query.eq("role", roleFilter);
  const { data: users } = await query;

  return (
    <DashboardShell title="Manage Users" subtitle="View and manage all registered accounts" tabs={ADMIN_TABS}>
      <div className="flex gap-2 flex-wrap">
        {[["all", "All"], ["seeker", "Job Seekers"], ["employer", "Employers"], ["admin", "Admins"]].map(([val, label]) => (
          <a
            key={val}
            href={`/dashboard/admin/users${val === "all" ? "" : `?role=${val}`}`}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              roleFilter === val ? "bg-green-600 text-white" : "bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Role</th>
              <th className="text-left p-4 font-semibold">Phone</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Joined</th>
              <th className="text-left p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
            {(users || []).map((u) => (
              <tr key={u.id}>
                <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{u.full_name}</td>
                <td className="p-4 text-gray-500 capitalize">{u.role}</td>
                <td className="p-4 text-gray-500">{u.phone || "—"}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                    u.account_status === "approved" ? "bg-green-100 text-green-700" : u.account_status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                  }`}>
                    {u.account_status}
                  </span>
                </td>
                <td className="p-4 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-4">
                  {u.role !== "admin" && <UserStatusControl userId={u.id} currentStatus={u.account_status} role={u.role} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users?.length && <p className="text-center text-gray-400 py-12">No users found.</p>}
      </div>
    </DashboardShell>
  );
}
