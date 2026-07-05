"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Spinner, FieldError } from "@/components/ui/Primitives";
import { useAuth } from "@/context/AuthContext";
import { forgotPasswordSchema, validate } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { sendPasswordReset } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    const { data, errors } = validate(forgotPasswordSchema, { email });
    if (errors) return setErrors(errors);
    setErrors({});
    setLoading(true);
    await sendPasswordReset(data.email);
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-32 pb-16 flex justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                If an account exists for <strong>{email}</strong>, a reset link has been sent.
              </p>
              <Link href="/login" className="inline-block mt-5 text-sm font-semibold text-green-600">← Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Reset Your Password</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Enter your email and we'll send you a reset link.</p>
              <input
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FieldError message={errors.email} />
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
              >
                {loading && <Spinner size={4} />}
                Send Reset Link
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">
                Remembered it? <Link href="/login" className="text-green-600 font-semibold">Sign In</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
