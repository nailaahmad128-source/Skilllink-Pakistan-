"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function useSavedJobs() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const { toast } = useToast();
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user || profile?.role !== "seeker") {
      setSavedIds(new Set());
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("saved_jobs").select("job_id").eq("seeker_id", user.id);
    setSavedIds(new Set((data || []).map((r) => r.job_id)));
    setLoading(false);
  }, [user, profile, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSave = async (jobId) => {
    if (!user) {
      toast("Please sign in to save jobs", "info");
      return;
    }
    if (profile?.role !== "seeker") {
      toast("Only job seeker accounts can save jobs", "info");
      return;
    }
    const isSaved = savedIds.has(jobId);
    setSavedIds((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(jobId) : next.add(jobId);
      return next;
    });

    if (isSaved) {
      const { error } = await supabase.from("saved_jobs").delete().eq("seeker_id", user.id).eq("job_id", jobId);
      if (error) toast("Could not remove saved job", "error");
    } else {
      const { error } = await supabase.from("saved_jobs").insert({ seeker_id: user.id, job_id: jobId });
      if (error) toast("Could not save job", "error");
      else toast("Job saved");
    }
  };

  return { savedIds, loading, toggleSave, refresh: load };
}
