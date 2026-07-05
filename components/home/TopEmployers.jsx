import Link from "next/link";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
const COLORS = ["#1B4F8A", "#C0392B", "#16a085", "#2980b9", "#27ae60", "#1565C0"];

export default function TopEmployers({ employers = [] }) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-green-600 dark:text-green-400">Hiring Now</span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">Top Employers</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Pakistan's most trusted companies actively hiring</p>
        </div>

        {employers.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No verified employers yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {employers.map((emp, i) => (
              <Link
                key={emp.id}
                href={`/employers/${emp.id}`}
                className="bg-white dark:bg-gray-950 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
              >
                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-black text-lg shadow-md"
                  style={{ background: COLORS[i % COLORS.length] }}
                >
                  {initials(emp.company_name)}
                </div>
                <div className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{emp.company_name}</div>
                <div className="text-gray-400 text-xs mt-0.5">{emp.industry || "Company"}</div>
                <div className="mt-2 inline-block text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
                  {emp.jobCount} Jobs
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/employers"
            className="inline-block px-6 py-2.5 rounded-xl border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-700 font-semibold text-sm hover:bg-green-600 hover:text-white dark:hover:bg-green-700 dark:hover:text-white transition"
          >
            Browse All Employers →
          </Link>
        </div>
      </div>
    </section>
  );
}
