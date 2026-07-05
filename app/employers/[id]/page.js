import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JobCard from "@/components/JobCard";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Primitives";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default async function EmployerDetailPage({ params }) {
  const supabase = createClient();
  const { data: employer } = await supabase
    .from("employer_profiles")
    .select("*")
    .eq("id", params.id)
    .eq("verification_status", "approved")
    .single();

  if (!employer) notFound();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, employer_profiles(company_name, logo_url), categories(label, icon)")
    .eq("employer_id", params.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 mb-8 flex items-center gap-5">
          <Avatar initials={initials(employer.company_name)} size="lg" />
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{employer.company_name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{employer.industry} {employer.city ? `· ${employer.city}` : ""}</p>
            {employer.website && (
              <a href={employer.website} target="_blank" rel="noreferrer" className="text-sm text-green-600 hover:underline">
                {employer.website}
              </a>
            )}
          </div>
        </div>

        {employer.description && (
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 mb-8">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">About</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{employer.description}</p>
          </div>
        )}

        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Open Positions ({jobs?.length || 0})</h3>
        {!jobs?.length ? (
          <p className="text-gray-400">No open positions right now.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
