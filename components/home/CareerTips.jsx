const TIPS = [
  { icon: "📝", title: "Craft a Standout CV", desc: "Use a clean format with quantified achievements. Pakistan employers prefer 2-page CVs with a professional photo." },
  { icon: "🤝", title: "Network on LinkedIn", desc: "Connect with HR managers and industry leaders. Many Pakistani jobs are filled through referrals before they're even posted." },
  { icon: "💬", title: "Master Urdu Interviews", desc: "Many Pakistani employers conduct interviews partially in Urdu. Practice common HR questions in both languages." },
  { icon: "🎯", title: "Target the Right Roles", desc: "Apply to roles matching at least 70% of the requirements. Quality applications beat quantity every time." },
];

export default function CareerTips() {
  return (
    <section id="tips" className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-green-600 dark:text-green-400">Expert Advice</span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">Career Tips for Pakistan</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Practical guidance tailored for the Pakistani job market</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIPS.map((tip, i) => (
            <div key={i} className="group p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-3">{tip.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2">{tip.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
