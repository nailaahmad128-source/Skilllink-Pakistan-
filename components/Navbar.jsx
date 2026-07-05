"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import NotificationBell from "./NotificationBell";

const COLORS = { green: "#0C6B38" };

const navLinks = [
  ["Home", "/"],
  ["Find Jobs", "/jobs"],
  ["Employers", "/employers"],
  ["Categories", "/categories"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("skilllink-dark") === "1";
    setDark(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("skilllink-dark", next ? "1" : "0");
  };

  const dashboardHref = profile
    ? profile.role === "admin"
      ? "/dashboard/admin"
      : profile.role === "employer"
      ? "/dashboard/employer"
      : "/dashboard/seeker"
    : "/login";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || dark || pathname !== "/" ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
                style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
              >
                S
              </div>
              <div className="leading-tight">
                <span className="font-black text-gray-900 dark:text-white text-base">Skill</span>
                <span className="font-black text-base" style={{ color: COLORS.green }}>
                  Link
                </span>
                <div className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 -mt-0.5 tracking-wider">PAKISTAN</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === href
                      ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-base"
              >
                {dark ? "☀️" : "🌙"}
              </button>

              {user ? (
                <>
                  <NotificationBell />
                  <Link
                    href={dashboardHref}
                    className="hidden sm:block px-3.5 py-1.5 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="hidden sm:block px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition active:scale-95 shadow"
                    style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="hidden sm:block px-3.5 py-1.5 text-sm font-semibold text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="hidden sm:block px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition active:scale-95 shadow"
                    style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
                  >
                    Post a Job
                  </button>
                </>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shadow-xl p-4 flex flex-col gap-1">
              {navLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    pathname === href
                      ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                {user ? (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 py-2 text-sm font-semibold text-green-700 border border-green-200 rounded-xl text-center"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMenuOpen(false);
                      }}
                      className="flex-1 py-2 text-sm font-semibold text-white rounded-xl"
                      style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setAuthOpen(true);
                        setMenuOpen(false);
                      }}
                      className="flex-1 py-2 text-sm font-semibold text-green-700 border border-green-200 rounded-xl"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthOpen(true);
                        setMenuOpen(false);
                      }}
                      className="flex-1 py-2 text-sm font-semibold text-white rounded-xl"
                      style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
                    >
                      Post a Job
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
