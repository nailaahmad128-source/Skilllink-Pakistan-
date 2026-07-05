"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function CvDownloadLink({ cvPath, label = "View CV" }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  if (!cvPath) return <span className="text-xs text-gray-400">No CV attached</span>;

  const open = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(cvPath, 300);
    setLoading(false);
    if (error || !data) return toast("Could not access CV — you may not have permission to view it.", "error");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button onClick={open} disabled={loading} className="text-xs font-semibold text-green-600 hover:underline disabled:opacity-50">
      📄 {loading ? "Loading..." : label}
    </button>
  );
}
