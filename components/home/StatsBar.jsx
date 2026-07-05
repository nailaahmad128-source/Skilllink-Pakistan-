import { createClient } from "@/lib/supabase/server";

export default async function StatsBar() {
  const supabase = createClient();
  const [{ count: jobs }, { count: seekers }, { count: employers }] = await Promise.all([
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("seeker_profiles").select("*", { count: "exact", head: true }),
    supabase.from("employer_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "approved"),
  ]);

  const stats = [
    { icon: "💼", val: (jobs || 0).toLocaleString(), label: "Active Jobs" },
    { icon: "👥", val: (seekers || 0).toLocaleString(), label: "Job Seekers" },
    { icon: "🏢", val: (employers || 0).toLocaleString(), label: "Verified Employers" },
    { icon: "🌍", val: "10+", label: "Cities Covered" },
  ];

  return (
    <section className="bg-white dark:bg-gray-950 py-10 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{s.val}</div>
            <div className="text-gray-500 dark:text-gray-400 text-xs font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
