import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getJobById } from "@/lib/data";
import { notFound } from "next/navigation";
import ApplyPanel from "./ApplyPanel";
import { Badge, Avatar } from "@/components/ui/Primitives";

export async function generateMetadata({ params }) {
  const job = await getJobById(params.id);
  if (!job) return {};
  return {
    title: `${job.title} at ${job.employer_profiles?.company_name || "Company"}`,
    description: job.description?.slice(0, 155),
  };
}

function formatSalary(min, max) {
  if (!min && !max) return "Negotiable";
  if (min && max) return `PKR ${Math.round(min / 1000)}k – ${Math.round(max / 1000)}k / month`;
  return `PKR ${Math.round((min || max) / 1000)}k+ / month`;
}

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default async function JobDetailPage({ params }) {
  const job = await getJobById(params.id);
  if (!job || job.status !== "approved") notFound();

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar initials={initials(job.employer_profiles?.company_name)} size="lg" />
            <div className="flex-1">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">{job.title}</h1>
              <p className="text-gray-500 dark:text-gray-400 font-semibold">{job.employer_profiles?.company_name}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge variant={job.job_type === "Full Time" ? "green" : "blue"}>{job.job_type}</Badge>
                {job.categories?.label && <Badge variant="gray">{job.categories.label}</Badge>}
                {job.is_hot && <Badge variant="red">🔥 Hot</Badge>}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8 text-sm">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-xs mb-1">📍 Location</div>
              <div className="font-bold text-gray-900 dark:text-white">{job.city}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-xs mb-1">💰 Salary</div>
              <div className="font-bold text-gray-900 dark:text-white">{formatSalary(job.salary_min, job.salary_max)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="text-gray-400 text-xs mb-1">🎯 Experience</div>
              <div className="font-bold text-gray-900 dark:text-white">{job.experience_level || "Not specified"}</div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Job Description</h3>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          {job.requirements && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Requirements</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">{job.requirements}</p>
            </div>
          )}

          {job.employer_profiles?.description && (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">About {job.employer_profiles.company_name}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{job.employer_profiles.description}</p>
            </div>
          )}
        </div>

        <ApplyPanel jobId={job.id} jobTitle={job.title} />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
