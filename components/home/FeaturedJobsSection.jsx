"use client";

import Link from "next/link";
import JobCard from "../JobCard";
import { useSavedJobs } from "@/hooks/useSavedJobs";

export default function FeaturedJobsSection({ jobs }) {
  const { savedIds, toggleSave } = useSavedJobs();

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-green-600 dark:text-green-400">Hand-Picked Roles</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1">Featured Jobs</h2>
          </div>
          <Link href="/jobs" className="text-sm font-semibold text-green-700 dark:text-green-400 hover:underline hidden sm:block">
            View All Jobs →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No approved jobs yet. Check back soon!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} saved={savedIds.has(job.id)} onSave={toggleSave} />
            ))}
          </div>
        )}

        <div className="text-center mt-6 sm:hidden">
          <Link href="/jobs" className="text-sm font-semibold text-green-700 dark:text-green-400">
            View All Jobs →
          </Link>
        </div>
      </div>
    </section>
  );
}
