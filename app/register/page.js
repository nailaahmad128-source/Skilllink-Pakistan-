"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Spinner, FieldError } from "@/components/ui/Primitives";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { registerSchema, validate } from "@/lib/validation";

const inputClass =
  "w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

export default function RegisterPage() {
  const [role, setRole] = useState("seeker");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", companyName: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const { data, errors } = validate(registerSchema, { role, ...form });
    if (errors) return setErrors(errors);
    setErrors({});
    setLoading(true);
    const { error } = await signUp(data);
    setLoading(false);
    if (error) return toast(error.message.includes("already registered") ? "An account with this email already exists" : error.message, "error");
    setDone(true);
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-32 pb-16 flex justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          {done ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <h2 className="font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We sent a confirmation link to <strong>{form.email}</strong>.
                {role === "employer" && " After confirming, our admin team will verify your account before you can post jobs."}
              </p>
              <Link href="/login" className="inline-block mt-5 text-sm font-semibold text-green-600">← Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Create Your Account</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Join 85,000+ professionals on SkillLink Pakistan</p>

              <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 border border-gray-200 dark:border-gray-700">
                {[["seeker", "👤 Job Seeker"], ["employer", "🏢 Employer"]].map(([r, l]) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${role === r ? "bg-green-600 text-white shadow" : "text-gray-600 dark:text-gray-400"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <input placeholder="Full Name" className={inputClass} value={form.fullName} onChange={set("fullName")} />
                  <FieldError message={errors.fullName} />
                </div>
                <div>
                  <input placeholder="Email Address" type="email" className={inputClass} value={form.email} onChange={set("email")} />
                  <FieldError message={errors.email} />
                </div>
                <div>
                  <input placeholder="Phone Number (03XXXXXXXXX)" type="tel" className={inputClass} value={form.phone} onChange={set("phone")} />
                  <FieldError message={errors.phone} />
                </div>
                <div>
                  <input placeholder="Password" type="password" className={inputClass} value={form.password} onChange={set("password")} />
                  <FieldError message={errors.password} />
                </div>
                <div>
                  <input placeholder="Confirm Password" type="password" className={inputClass} value={form.confirmPassword} onChange={set("confirmPassword")} />
                  <FieldError message={errors.confirmPassword} />
                </div>
                {role === "employer" && (
                  <div>
                    <input placeholder="Company Name" className={inputClass} value={form.companyName} onChange={set("companyName")} />
                    <FieldError message={errors.companyName} />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
                >
                  {loading && <Spinner size={4} />}
                  Create {role === "employer" ? "Employer" : "Job Seeker"} Account
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                Already have an account? <Link href="/login" className="text-green-600 font-semibold">Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
