"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";

export default function JobRowActions({ jobId }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const deleteJob = async () => {
    if (!confirm("Delete this job permanently? All applications for it will also be removed.")) return;
    setLoading(true);
    const { error } = await supabase.from("jobs").delete().eq("id", jobId);
    setLoading(false);
    if (error) return toast("Could not delete job", "error");
    toast("Job deleted");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <Link href={`/dashboard/employer/jobs/${jobId}/edit`} className="text-xs font-semibold text-blue-600 hover:underline">
        Edit
      </Link>
      <button onClick={deleteJob} disabled={loading} className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50">
        Delete
      </button>
    </div>
  );
}
