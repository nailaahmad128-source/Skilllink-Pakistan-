"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function UserStatusControl({ userId, currentStatus, role }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const toggle = async () => {
    const next = currentStatus === "approved" ? "rejected" : "approved";
    if (!confirm(`${next === "rejected" ? "Suspend" : "Reactivate"} this ${role} account?`)) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update({ account_status: next }).eq("id", userId);
    setLoading(false);
    if (error) return toast("Action failed", "error");
    toast(`Account ${next === "rejected" ? "suspended" : "reactivated"}`);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs font-semibold px-3 py-1 rounded-lg disabled:opacity-50 ${
        currentStatus === "approved" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
      }`}
    >
      {currentStatus === "approved" ? "Suspend" : "Reactivate"}
    </button>
  );
}
