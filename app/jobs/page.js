import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JobsSearchBar from "@/components/jobs/JobsSearchBar";
import JobsFiltersSidebar from "@/components/jobs/JobsFiltersSidebar";
import SortSelect from "@/components/jobs/SortSelect";
import JobsGrid from "@/components/jobs/JobsGrid";
import Pagination from "@/components/jobs/Pagination";
import { searchJobs, getCategories, getCities } from "@/lib/data";

export const metadata = {
  title: "Find Jobs in Pakistan",
  description: "Search thousands of verified job listings across Karachi, Lahore, Islamabad and all major cities in Pakistan.",
};

const PAGE_SIZE = 10;

export default async function JobsPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const categoryIds = Array.isArray(searchParams.category) ? searchParams.category : searchParams.category ? [searchParams.category] : [];
  const jobTypes = Array.isArray(searchParams.type) ? searchParams.type : searchParams.type ? [searchParams.type] : [];

  const [{ jobs, total }, categories, cities] = await Promise.all([
    searchJobs({
      keyword: searchParams.q || "",
      city: searchParams.city || "",
      categoryIds,
      jobTypes,
      sort: searchParams.sort || "recent",
      page,
      pageSize: PAGE_SIZE,
    }),
    getCategories(),
    getCities(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <Suspense fallback={<div className="h-40" />}>
          <JobsSearchBar cities={cities} />
        </Suspense>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex gap-6">
            <Suspense fallback={<div className="w-56 hidden lg:block" />}>
              <JobsFiltersSidebar categories={categories} />
            </Suspense>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Showing <strong className="text-gray-900 dark:text-white">{total.toLocaleString()}</strong> jobs
                </span>
                <Suspense fallback={null}>
                  <SortSelect />
                </Suspense>
              </div>

              <JobsGrid jobs={jobs} />

              <Suspense fallback={null}>
                <Pagination page={page} totalPages={totalPages} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
