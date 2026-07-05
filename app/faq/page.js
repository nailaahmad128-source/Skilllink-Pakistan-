"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const faqs = [
  ["Is SkillLink Pakistan free to use?", "Yes! Job seekers can register, build profiles, and apply to jobs completely free. Employers have free and premium plans."],
  ["How do I apply for a job?", "Create a free account, complete your profile, upload your CV, then click 'Apply Now' on any job listing."],
  ["Are the employers verified?", "All employers go through an admin verification process before they can post jobs on the platform."],
  ["Can I post jobs as an individual employer?", "Yes, both companies and individual employers (e.g., madaris, schools, clinics) can post jobs."],
  ["How long does job approval take?", "Our admin team reviews and approves job posts within 12–24 hours on working days."],
  ["Is there a mobile app?", "A mobile app for Android and iOS is coming soon. Meanwhile, our website is fully mobile-responsive."],
  ["How do I contact an employer?", "Apply through SkillLink and the employer will contact you directly if your profile matches."],
  ["Can I save jobs for later?", "Yes — click the star icon on any job listing to save it to your dashboard."],
];

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen font-sans bg-white dark:bg-gray-950">
      <Navbar />
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h1>
            <p className="text-gray-500 dark:text-gray-400">Everything you need to know about SkillLink Pakistan</p>
          </div>
          <div className="space-y-3">
            {faqs.map(([q, a], i) => (
              <div key={i} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900 dark:text-white text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                  {q}
                  <span className={`text-gray-400 transition-transform ${open === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {open === i && (
                  <div className="px-5 pb-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-3">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
