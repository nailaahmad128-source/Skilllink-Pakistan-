import DashboardShell from "@/components/dashboard/DashboardShell";
import CategoryManager from "@/components/dashboard/admin/CategoryManager";
import CityManager from "@/components/dashboard/admin/CityManager";
import { requireRole } from "@/lib/authGuard";
import { ADMIN_TABS } from "@/lib/dashboardTabs";

export const metadata = { title: "Categories & Cities" };

export default async function AdminCategoriesPage() {
  const { supabase } = await requireRole(["admin"]);
  const [{ data: categories }, { data: cities }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("cities").select("*").order("sort_order"),
  ]);

  return (
    <DashboardShell title="Categories & Cities" subtitle="Manage the taxonomy used across job listings" tabs={ADMIN_TABS}>
      <div className="grid lg:grid-cols-2 gap-4">
        <CategoryManager initialCategories={categories || []} />
        <CityManager initialCities={cities || []} />
      </div>
    </DashboardShell>
  );
}
