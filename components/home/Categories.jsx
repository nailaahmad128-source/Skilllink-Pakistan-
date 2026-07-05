import Link from "next/link";

const GRADIENTS = [
  "from-emerald-600 to-green-700", "from-teal-600 to-emerald-700", "from-green-600 to-teal-700",
  "from-blue-600 to-indigo-700", "from-indigo-600 to-blue-700", "from-cyan-600 to-blue-700",
  "from-slate-600 to-blue-700", "from-violet-600 to-blue-700", "from-amber-600 to-orange-700",
  "from-rose-600 to-pink-700", "from-emerald-700 to-teal-800", "from-orange-500 to-red-600",
  "from-purple-600 to-violet-700", "from-sky-600 to-blue-700", "from-gray-600 to-slate-700",
];

export default function Categories({ categories = [], showViewAll = true }) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-green-600 dark:text-green-400">Explore Opportunities</span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">Browse by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">15+ professional categories across every field in Pakistan</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/jobs?category=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} opacity-90`} />
              <div className="relative z-10">
                <div className="text-2xl mb-2">{cat.icon}</div>
                <div className="text-white font-bold text-sm leading-tight mb-1.5">{cat.label}</div>
                <div className="text-white/70 text-xs font-medium">{(cat.count || 0).toLocaleString()} jobs</div>
              </div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500" />
            </Link>
          ))}
        </div>

        {showViewAll && (
          <div className="text-center mt-8">
            <Link
              href="/categories"
              className="inline-block px-6 py-2.5 rounded-xl border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-700 font-semibold text-sm hover:bg-green-600 hover:text-white dark:hover:bg-green-700 dark:hover:text-white transition"
            >
              View All Categories →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
