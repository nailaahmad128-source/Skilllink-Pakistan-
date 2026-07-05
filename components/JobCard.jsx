import Link from "next/link";
import { Avatar, Badge } from "./ui/Primitives";

function daysAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
  return diff <= 0 ? "Today" : `${diff}d ago`;
}

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatSalary(min, max) {
  if (!min && !max) return "Negotiable";
  if (min && max) return `PKR ${Math.round(min / 1000)}k–${Math.round(max / 1000)}k`;
  return `PKR ${Math.round((min || max) / 1000)}k+`;
}

export default function JobCard({ job, saved, onSave }) {
  const company = job.employer_profiles?.company_name || "Company";
  const logoColor = job.employer_profiles?.logo_url ? undefined : "#1B4F8A";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-3">
        <Link href={`/jobs/${job.id}`} className="flex items-center gap-3 min-w-0">
          <Avatar initials={initials(company)} color={logoColor} size="md" />
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition truncate">
              {job.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">{company}</p>
          </div>
        </Link>
        {onSave && (
          <button
            onClick={() => onSave(job.id)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition flex-shrink-0 ${
              saved ? "text-amber-500 bg-amber-50 dark:bg-amber-950" : "text-gray-300 hover:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {saved ? "★" : "☆"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant={job.job_type === "Full Time" ? "green" : job.job_type === "Contract" ? "blue" : "gold"}>{job.job_type}</Badge>
        {job.categories?.label && <Badge variant="gray">{job.categories.label}</Badge>}
        {job.is_hot && <Badge variant="red">🔥 Hot</Badge>}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-3">
        <span>📍 {job.city}</span>
        <span>💰 {formatSalary(job.salary_min, job.salary_max)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Posted {daysAgo(job.created_at)}</span>
        <Link href={`/jobs/${job.id}`} className="text-xs font-bold text-green-700 dark:text-green-400 hover:underline">
          Apply Now →
        </Link>
      </div>
    </div>
  );
}
