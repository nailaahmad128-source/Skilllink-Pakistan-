"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Spinner, FieldError } from "@/components/ui/Primitives";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { loginSchema, validate } from "@/lib/validation";

const inputClass =
  "w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const { data, errors } = validate(loginSchema, form);
    if (errors) return setErrors(errors);
    setErrors({});
    setLoading(true);
    const { error } = await signIn(data);
    setLoading(false);
    if (error) return toast(error.message === "Invalid login credentials" ? "Incorrect email or password" : error.message, "error");
    toast("Welcome back!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-32 pb-16 flex justify-center px-4">
        <form onSubmit={submit} className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Sign In to SkillLink</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Welcome back! Find your next opportunity.</p>
          <div className="space-y-3">
            <div>
              <input placeholder="Email Address" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <FieldError message={errors.email} />
            </div>
            <div>
              <input placeholder="Password" type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <FieldError message={errors.password} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
            >
              {loading && <Spinner size={4} />}
              Sign In
            </button>
          </div>
          <div className="flex justify-between mt-4 text-xs">
            <Link href="/forgot-password" className="text-gray-500 hover:text-green-600 font-medium">Forgot password?</Link>
            <Link href="/register" className="text-green-600 font-semibold">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
