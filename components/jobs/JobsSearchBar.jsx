"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function JobsSearchBar({ cities }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const selectedCity = searchParams.get("city") || "";

  const doSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    keyword ? params.set("q", keyword) : params.delete("q");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const setCity = (value) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set("city", value) : params.delete("city");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="py-8 px-4 sm:px-6" style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-4">Find Your Next Job in Pakistan</h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
            <span className="text-gray-400">🔍</span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="Job title or keyword..."
              className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white outline-none"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 sm:w-40">
            <span className="text-gray-400">📍</span>
            <select value={selectedCity} onChange={(e) => setCity(e.target.value)} className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white outline-none">
              <option value="">All Pakistan</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <button onClick={doSearch} className="px-6 py-2.5 rounded-xl text-white font-bold text-sm" style={{ background: "#E8A020" }}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
