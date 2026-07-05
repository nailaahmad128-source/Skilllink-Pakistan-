"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function DashboardShell({ title, subtitle, tabs, children, banner }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>
          </div>
        </div>

        {banner}

        <div className="flex gap-6">
          <aside className="w-48 hidden lg:block flex-shrink-0">
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-2 space-y-0.5">
              {tabs.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    pathname === href ? "bg-green-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </aside>

          {/* Mobile tab bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex overflow-x-auto">
            {tabs.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`flex-1 text-center py-3 text-xs font-semibold whitespace-nowrap px-3 ${
                  pathname === href ? "text-green-600 border-t-2 border-green-600" : "text-gray-500"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <main className="flex-1 space-y-4 pb-16 lg:pb-0 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
