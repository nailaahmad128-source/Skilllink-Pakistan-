"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "recent";

  const setSort = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-3 py-1.5 focus:outline-none"
    >
      <option value="recent">Most Recent</option>
      <option value="salary_high">Salary: High to Low</option>
    </select>
  );
}
