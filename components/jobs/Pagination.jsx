"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ page, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);
  if (start > 1) pages.unshift("...", 1);
  if (end < totalPages) pages.push("...", totalPages);

  return (
    <div className="flex justify-center mt-8 gap-2 flex-wrap">
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${
              p === page ? "bg-green-600 text-white" : "bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-green-300"
            }`}
          >
            {p}
          </button>
        )
      )}
    </div>
  );
}
