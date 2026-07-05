"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function EmployerApprovalRow({ employer }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const act = async (verification_status) => {
    let rejection_reason = null;
    if (verification_status === "rejected") {
      rejection_reason = prompt("Reason for rejection (shown to employer):") || "Did not meet verification requirements";
    }
    setLoading(true);
    const { error } = await supabase.from("employer_profiles").update({ verification_status, rejection_reason }).eq("id", employer.id);
    setLoading(false);
    if (error) return toast("Action failed", "error");
    toast(`Employer ${verification_status}`);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 flex-wrap gap-2">
      <div>
        <div className="font-semibold text-gray-900 dark:text-white text-sm">{employer.company_name}</div>
        <div className="text-xs text-gray-400">
          {employer.industry || "No industry set"} · {employer.city || "No city set"} · Registered {new Date(employer.created_at).toLocaleDateString()}
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
