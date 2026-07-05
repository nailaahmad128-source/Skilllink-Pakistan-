"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Spinner, FieldError } from "@/components/ui/Primitives";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { resetPasswordSchema, validate } from "@/lib/validation";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const { data, errors } = validate(resetPasswordSchema, form);
    if (errors) return setErrors(errors);
    setErrors({});
    setLoading(true);
    const { error } = await updatePassword(data.password);
    setLoading(false);
    if (error) return toast(error.message, "error");
    toast("Password updated! Please sign in with your new password.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="pt-32 pb-16 flex justify-center px-4">
        <form onSubmit={submit} className="w-full max-w-md bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Set a New Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Choose a strong password for your account.</p>
          <div className="space-y-3">
            <div>
              <input placeholder="New Password" type="password" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <FieldError message={errors.password} />
            </div>
            <div>
              <input placeholder="Confirm New Password" type="password" className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
              <FieldError message={errors.confirmPassword} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
            >
              {loading && <Spinner size={4} />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
