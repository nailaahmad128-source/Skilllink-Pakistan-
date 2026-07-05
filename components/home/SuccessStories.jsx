"use client";

import { useState } from "react";
import { StarRating } from "../ui/Primitives";

const STORIES = [
  { name: "Muhammad Bilal", role: "Software Engineer at TRG Pakistan", city: "Lahore", img: "MB", story: "Found my dream job in 3 weeks through SkillLink. The platform's filters helped me target only the best companies.", stars: 5 },
  { name: "Dr. Aisha Siddiqui", role: "Physician at Aga Khan Hospital", city: "Karachi", img: "AS", story: "As a female doctor, I needed a trustworthy platform. SkillLink's verified employers gave me confidence to apply.", stars: 5 },
  { name: "Hafiz Abdullah", role: "Quran Teacher at Al-Huda Institute", city: "Islamabad", img: "HA", story: "Dedicated Islamic education category made it so easy to find the perfect teaching position. JazakAllah Khair!", stars: 5 },
];

export default function SuccessStories() {
  const [active, setActive] = useState(0);

  return (
    <section id="stories" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest uppercase text-green-600 dark:text-green-400">Real People, Real Results</span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-1 mb-2">Success Stories</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Thousands of Pakistanis found their careers through SkillLink</p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-black text-xl shadow-lg"
            style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
          >
            {STORIES[active].img}
          </div>
          <StarRating count={STORIES[active].stars} />
          <blockquote className="text-gray-700 dark:text-gray-300 text-base italic mt-4 mb-4 leading-relaxed max-w-xl mx-auto">
            "{STORIES[active].story}"
          </blockquote>
          <div className="font-bold text-gray-900 dark:text-white">{STORIES[active].name}</div>
          <div className="text-green-700 dark:text-green-400 text-sm font-medium mt-0.5">{STORIES[active].role}</div>
          <div className="text-gray-400 text-xs mt-0.5">📍 {STORIES[active].city}</div>

          <div className="flex justify-center gap-2 mt-6">
            {STORIES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all ${i === active ? "w-6 h-2.5 bg-green-600" : "w-2.5 h-2.5 bg-gray-200 dark:bg-gray-700"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
