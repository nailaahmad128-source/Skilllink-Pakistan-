"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CITIES = ["All Pakistan", "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];
const displayCats = ["Software Engineer", "School Teacher", "Imam & Khateeb", "MBBS Doctor", "Civil Engineer"];

export default function Hero() {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("All Pakistan");
  const [animIn, setAnimIn] = useState(false);
  const [catWord, setCatWord] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCatWord((w) => (w + 1) % displayCats.length), 2000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (city && city !== "All Pakistan") params.set("city", city);
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #0a4f2a 0%, #0C6B38 35%, #1B4F8A 70%, #0e2f5c 100%)" }}
      />
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div
        className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center transition-all duration-1000 ${
          animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-semibold mb-6">
          🇵🇰 Pakistan's #1 Career Platform — 85,000+ Professionals
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight">
          Find Your Next <span style={{ color: "#E8A020" }}>{displayCats[catWord]}</span>
          <br /> Job in Pakistan
        </h1>
        <p className="text-white/70 text-base sm:text-lg mb-10 max-w-xl mx-auto">
          From Islamic scholars to software engineers — connecting every profession with trusted employers nationwide.
        </p>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl mx-auto">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
            <span className="text-gray-400">🔍</span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Job title or keyword..."
              className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white outline-none"
            />
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 sm:w-44">
            <span className="text-gray-400">📍</span>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="flex-1 bg-transparent text-sm text-gray-800 dark:text-white outline-none">
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSearch} className="px-6 py-2.5 rounded-xl text-white font-bold text-sm" style={{ background: "#E8A020" }}>
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
