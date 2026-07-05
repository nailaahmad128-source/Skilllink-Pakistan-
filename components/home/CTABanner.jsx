"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "../AuthModal";

export default function CTABanner() {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, profile } = useAuth();
  const router = useRouter();

  const goToDashboard = () => {
    if (!user) return setAuthOpen(true);
    router.push(profile?.role === "employer" ? "/dashboard/employer/jobs/new" : "/jobs");
  };

  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl p-10 text-center" style={{ background: "linear-gradient(135deg, #0C6B38 0%, #1B4F8A 100%)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "#E8A020", transform: "translate(30%,-30%)" }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: "#fff", transform: "translate(-30%,30%)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Ready to Advance Your Career?</h2>
            <p className="text-white/70 text-base max-w-xl mx-auto mb-8">
              Join 85,000+ professionals on SkillLink Pakistan. Free to join, easy to use, and completely trusted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => (user ? router.push("/jobs") : setAuthOpen(true))}
                className="px-8 py-3.5 rounded-xl font-bold text-white text-sm shadow-xl transition active:scale-95"
                style={{ background: "linear-gradient(135deg, #E8A020, #e06b00)" }}
              >
                🚀 Find Your Job Now — Free
              </button>
              <button onClick={goToDashboard} className="px-8 py-3.5 rounded-xl font-bold text-white/90 border-2 border-white/30 text-sm hover:bg-white/10 transition">
                🏢 Post a Job as Employer
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </section>
  );
}
