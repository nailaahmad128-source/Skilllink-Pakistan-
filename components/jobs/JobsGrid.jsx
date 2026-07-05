"use client";

import JobCard from "@/components/JobCard";
import { useSavedJobs } from "@/hooks/useSavedJobs";

export default function JobsGrid({ jobs }) {
  const { savedIds, toggleSave } = useSavedJobs();

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="text-4xl mb-3">🔍</div>
        <p className="text-gray-500 dark:text-gray-400 font-semibold">No jobs match your filters</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or clearing filters</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} saved={savedIds.has(job.id)} onSave={toggleSave} />
      ))}
    </div>
  );
}
