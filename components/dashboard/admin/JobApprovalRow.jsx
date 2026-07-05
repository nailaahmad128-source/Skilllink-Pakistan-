"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function JobApprovalRow({ job }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const act = async (status) => {
    let rejection_reason = null;
    if (status === "rejected") {
      rejection_reason = prompt("Reason for rejection (shown to employer):") || "Did not meet platform guidelines";
    }
    setLoading(true);
    const { error } = await supabase.from("jobs").update({ status, rejection_reason }).eq("id", job.id);
    setLoading(false);
    if (error) return toast("Action failed", "error");
    toast(`Job ${status}`);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
      <div>
        <div className="font-semibold text-gray-900 dark:text-white text-sm">{job.title}</div>
        <div className="text-xs text-gray-400">
          {job.employer_profiles?.company_name} · {job.categories?.label || "Uncategorized"} · {new Date(job.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => act("approved")} disabled={loading} className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white font-semibold disabled:opacity-50">
          Approve
        </button>
        <button onClick={() => act("rejected")} disabled={loading} className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-700 font-semibold disabled:opacity-50">
          Reject
        </button>
      </div>
    </div>
  );
}
