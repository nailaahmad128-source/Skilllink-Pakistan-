"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const TYPES = ["Full Time", "Part Time", "Contract", "Remote", "Overseas"];

export default function JobsFiltersSidebar({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTypes = searchParams.getAll("type");
  const selectedCats = searchParams.getAll("category");

  const toggleMulti = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll(key);
    params.delete(key);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    next.forEach((v) => params.append(key, v));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="w-56 hidden lg:block flex-shrink-0">
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-5 sticky top-20">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Job Type</h4>
          {TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2.5 py-1 cursor-pointer">
              <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleMulti("type", t)} className="accent-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{t}</span>
            </label>
          ))}
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Category</h4>
          <div className="max-h-56 overflow-y-auto pr-1 space-y-1">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2.5 py-1 cursor-pointer">
                <input type="checkbox" checked={selectedCats.includes(c.id)} onChange={() => toggleMulti("category", c.id)} className="accent-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{c.icon} {c.label.split(" ")[0]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
