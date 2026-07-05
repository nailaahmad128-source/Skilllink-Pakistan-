"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function WithdrawButton({ applicationId }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const withdraw = async () => {
    if (!confirm("Withdraw this application? This cannot be undone.")) return;
    setLoading(true);
    const { error } = await supabase.from("applications").delete().eq("id", applicationId);
    setLoading(false);
    if (error) return toast("Could not withdraw application", "error");
    toast("Application withdrawn");
    router.refresh();
  };

  return (
    <button onClick={withdraw} disabled={loading} className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50">
      Withdraw
    </button>
  );
}
