"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

const STATUSES = ["applied", "reviewed", "shortlisted", "rejected", "hired"];

export default function ApplicationStatusControl({ applicationId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const updateStatus = async (newStatus) => {
    setLoading(true);
    setStatus(newStatus);
    const { error } = await supabase.from("applications").update({ status: newStatus }).eq("id", applicationId);
    setLoading(false);
    if (error) {
      toast("Could not update status", "error");
      setStatus(currentStatus);
      return;
    }
    toast(`Status updated to "${newStatus}"`);
    router.refresh();
  };

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => updateStatus(e.target.value)}
      className="text-xs font-semibold border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-2.5 py-1.5 capitalize focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
