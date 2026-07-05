import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
              >
                S
              </div>
              <div>
                <span className="font-black text-white text-lg">Skill</span>
                <span className="font-black text-lg text-green-400">Link</span>
                <div className="text-[10px] text-gray-500 tracking-wider -mt-0.5">PAKISTAN</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
              Pakistan's most trusted career platform connecting talented professionals with leading employers nationwide.
            </p>
            <div className="flex gap-3">
              {["📘", "🐦", "💼", "📸"].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-base">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {[
            ["For Job Seekers", [["Find Jobs", "/jobs"], ["Upload CV", "/dashboard/seeker/profile"], ["Career Tips", "/#tips"], ["Success Stories", "/#stories"], ["Free Registration", "/register"]]],
            ["For Employers", [["Post a Job", "/dashboard/employer/jobs/new"], ["Search Candidates", "/dashboard/employer"], ["Company Profile", "/dashboard/employer/profile"], ["Pricing Plans", "/contact"], ["HR Resources", "/faq"]]],
            ["Company", [["About Us", "/about"], ["Contact Us", "/contact"], ["FAQ", "/faq"], ["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"]]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-white mb-4 text-sm">{title}</h4>
              <ul className="space-y-2">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-400 hover:text-green-400 text-sm transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} SkillLink Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-green-400 transition">Terms of Service</Link>
            <Link href="/faq" className="hover:text-green-400 transition">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
