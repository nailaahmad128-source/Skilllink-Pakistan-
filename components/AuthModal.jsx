"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "./ui/Modal";
import { FieldError, Spinner } from "./ui/Primitives";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { loginSchema, registerSchema, forgotPasswordSchema, validate } from "@/lib/validation";

const inputClass =
  "w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

export default function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState("login");
  const [role, setRole] = useState("seeker");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const [resetSent, setResetSent] = useState(false);

  const { signIn, signUp, sendPasswordReset } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const resetState = () => {
    setErrors({});
    setForm({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", companyName: "" });
    setResetSent(false);
  };

  const close = () => {
    resetState();
    setTab("login");
    onClose();
  };

  const handleLogin = async () => {
    const { data, errors } = validate(loginSchema, { email: form.email, password: form.password });
    if (errors) return setErrors(errors);
    setErrors({});
    setLoading(true);
    const { error } = await signIn(data);
    setLoading(false);
    if (error) {
      toast(error.message === "Invalid login credentials" ? "Incorrect email or password" : error.message, "error");
      return;
    }
    toast("Welcome back!");
    close();
    router.refresh();
  };

  const handleRegister = async () => {
    const { data, errors } = validate(registerSchema, {
      role,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      confirmPassword: form.confirmPassword,
      companyName: form.companyName,
    });
    if (errors) return setErrors(errors);
    setErrors({});
    setLoading(true);
    const { error } = await signUp(data);
    setLoading(false);
    if (error) {
      toast(error.message.includes("already registered") ? "An account with this email already exists" : error.message, "error");
      return;
    }
    toast(
      role === "employer"
        ? "Account created! Check your email to confirm, then wait for admin verification before posting jobs."
        : "Account created! Check your email to confirm your address.",
      "success",
      6000
    );
    close();
  };

  const handleForgot = async () => {
    const { data, errors } = validate(forgotPasswordSchema, { email: form.email });
    if (errors) return setErrors(errors);
    setErrors({});
    setLoading(true);
    const { error } = await sendPasswordReset(data.email);
    setLoading(false);
    if (error) return toast(error.message, "error");
    setResetSent(true);
  };

  const submit = () => {
    if (tab === "login") return handleLogin();
    if (tab === "register") return handleRegister();
    if (tab === "forgot") return handleForgot();
  };

  return (
    <Modal open={open} onClose={close} title="">
      {tab !== "forgot" && (
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-5">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setErrors({});
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-white dark:bg-gray-700 shadow text-green-700 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>
      )}

      {tab === "forgot" && (
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Reset your password</h2>
      )}

      {tab === "register" && (
        <div className="flex gap-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 border border-gray-200 dark:border-gray-700">
          {[
            ["seeker", "👤 Job Seeker"],
            ["employer", "🏢 Employer"],
          ].map(([r, l]) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === r ? "bg-green-600 text-white shadow" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {tab === "forgot" && resetSent ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">📧</div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            If an account exists for <strong>{form.email}</strong>, a reset link has been sent.
          </p>
          <button onClick={() => { setTab("login"); resetState(); }} className="mt-4 text-sm font-semibold text-green-600">
            ← Back to Sign In
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tab === "register" && (
            <div>
              <input placeholder="Full Name" className={inputClass} value={form.fullName} onChange={set("fullName")} />
              <FieldError message={errors.fullName} />
            </div>
          )}
          <div>
            <input placeholder="Email Address" type="email" className={inputClass} value={form.email} onChange={set("email")} />
            <FieldError message={errors.email} />
          </div>
          {tab === "register" && (
            <div>
              <input placeholder="Phone Number (03XXXXXXXXX)" type="tel" className={inputClass} value={form.phone} onChange={set("phone")} />
              <FieldError message={errors.phone} />
            </div>
          )}
          {tab !== "forgot" && (
            <div>
              <input placeholder="Password" type="password" className={inputClass} value={form.password} onChange={set("password")} />
              <FieldError message={errors.password} />
            </div>
          )}
          {tab === "register" && (
            <div>
              <input placeholder="Confirm Password" type="password" className={inputClass} value={form.confirmPassword} onChange={set("confirmPassword")} />
              <FieldError message={errors.confirmPassword} />
            </div>
          )}
          {tab === "register" && role === "employer" && (
            <div>
              <input placeholder="Company Name" className={inputClass} value={form.companyName} onChange={set("companyName")} />
              <FieldError message={errors.companyName} />
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
          >
            {loading && <Spinner size={4} />}
            {tab === "login" && "Sign In to SkillLink"}
            {tab === "register" && `Create ${role === "employer" ? "Employer" : "Job Seeker"} Account`}
            {tab === "forgot" && "Send Reset Link"}
          </button>
        </div>
      )}

      {tab === "login" && (
        <p className="text-center text-xs text-gray-400 mt-3">
          <button onClick={() => { setTab("forgot"); setErrors({}); }} className="text-gray-500 hover:text-green-600 font-medium">
            Forgot your password?
          </button>
        </p>
      )}

      {tab === "login" && !resetSent && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Don't have an account?{" "}
          <button onClick={() => setTab("register")} className="text-green-600 font-semibold">
            Register Free
          </button>
        </p>
      )}

      {tab !== "forgot" && (
        <>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="flex gap-3 mt-3">
            {[
              ["google", "🔵 Google"],
              ["linkedin_oidc", "🟦 LinkedIn"],
            ].map(([provider, label]) => (
              <button
                key={provider}
                onClick={async () => {
                  const { createClient } = await import("@/lib/supabase/client");
                  const supabase = createClient();
                  await supabase.auth.signInWithOAuth({
                    provider,
                    options: { redirectTo: `${window.location.origin}/auth/callback` },
                  });
                }}
                className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
