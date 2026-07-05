import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-16 min-h-screen bg-white dark:bg-gray-950">
        <div className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}>
          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">About SkillLink Pakistan</h1>
            <p className="text-white/75 text-lg leading-relaxed">
              Pakistan's first truly inclusive career platform — connecting every profession, every city, every dream.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-green-600">Our Mission</span>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-4">Empowering Pakistan's Workforce</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                SkillLink Pakistan was founded with one clear mission: to make finding and filling jobs easier for every Pakistani — whether you're an Islamic scholar in Lahore, a software engineer in Karachi, or a doctor seeking overseas opportunities.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We believe every skilled Pakistani deserves access to opportunities. Our platform bridges the gap between talent and employers across all 15+ professions and all major cities.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["🌍", "Nationwide Coverage"], ["🔒", "Secure Platform"], ["📱", "Mobile-First"], ["🤝", "Trusted by Thousands"]].map(([icon, label]) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Our Values</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                { icon: "🕊️", title: "Integrity", desc: "We operate with full transparency. Every employer is verified, every listing is real." },
                { icon: "🌐", title: "Inclusivity", desc: "From imams to engineers, we welcome every profession and background on our platform." },
                { icon: "🚀", title: "Innovation", desc: "We use cutting-edge technology to make job hunting and hiring faster, easier, smarter." },
              ].map((v, i) => (
                <div key={i} className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                  <div className="text-4xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
