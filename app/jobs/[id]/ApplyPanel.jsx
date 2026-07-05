"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Spinner } from "@/components/ui/Primitives";
import AuthModal from "@/components/AuthModal";
import { applicationSchema, validate } from "@/lib/validation";

export default function ApplyPanel({ jobId, jobTitle }) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();
  const [authOpen, setAuthOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [seekerProfile, setSeekerProfile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user || profile?.role !== "seeker") {
        setChecking(false);
        return;
      }
      const [{ data: existing }, { data: sp }] = await Promise.all([
        supabase.from("applications").select("id").eq("job_id", jobId).eq("seeker_id", user.id).maybeSingle(),
        supabase.from("seeker_profiles").select("cv_url").eq("id", user.id).single(),
      ]);
      if (!mounted) return;
      setAlreadyApplied(!!existing);
      setSeekerProfile(sp);
      setChecking(false);
    })();
    return () => { mounted = false; };
  }, [user, profile, jobId, supabase]);

  const handleApply = async () => {
    const { data, errors } = validate(applicationSchema, { coverLetter });
    if (errors) return setError(errors.coverLetter || "Please check your input");
    setError("");
    setSubmitting(true);
    const { error: insertError } = await supabase.from("applications").insert({
      job_id: jobId,
      seeker_id: user.id,
      cover_letter: data.coverLetter || null,
      cv_url_snapshot: seekerProfile?.cv_url || null,
    });
    setSubmitting(false);
    if (insertError) {
      toast(insertError.code === "23505" ? "You already applied for this job" : "Something went wrong. Please try again.", "error");
      return;
    }
    setAlreadyApplied(true);
    toast(`Applied for ${jobTitle}! You can track status in your dashboard.`);
  };

  if (checking) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4 font-semibold">Sign in as a Job Seeker to apply for this role.</p>
        <button
          onClick={() => setAuthOpen(true)}
          className="px-6 py-2.5 rounded-xl font-bold text-white text-sm"
          style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
        >
          Sign In to Apply
        </button>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  if (profile?.role !== "seeker") {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
        Only Job Seeker accounts can apply for jobs.
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-3xl p-6 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="font-bold text-green-800 dark:text-green-300">You've already applied for this job.</p>
        <Link href="/dashboard/seeker/applications" className="text-sm font-semibold text-green-700 dark:text-green-400 hover:underline mt-2 inline-block">
          Track your application →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-3">Apply for this job</h3>
      {!seekerProfile?.cv_url && (
        <p className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300 rounded-lg px-3 py-2 mb-3">
          Tip: <Link href="/dashboard/seeker/profile" className="underline font-semibold">upload your CV</Link> first to strengthen your application.
        </p>
      )}
      <textarea
        rows={4}
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        placeholder="Add a short cover letter (optional)..."
        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-2"
      />
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <button
        onClick={handleApply}
        disabled={submitting}
        className="w-full py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
      >
        {submitting && <Spinner size={4} />}
        Submit Application
      </button>
    </div>
  );
}
