"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import { Spinner, FieldError } from "@/components/ui/Primitives";
import { jobPostSchema, validate } from "@/lib/validation";

const inputClass =
  "w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];
const TYPES = ["Full Time", "Part Time", "Contract", "Remote", "Overseas"];
const EXPERIENCE_LEVELS = ["Entry Level", "1-3 years", "3-5 years", "5-10 years", "10+ years"];

export default function JobForm({ employerId, categories, existingJob }) {
  const isEdit = !!existingJob;
  const [form, setForm] = useState({
    title: existingJob?.title || "",
    description: existingJob?.description || "",
    categoryId: existingJob?.category_id || "",
    city: existingJob?.city || "",
    jobType: existingJob?.job_type || "Full Time",
    salaryMin: existingJob?.salary_min || "",
    salaryMax: existingJob?.salary_max || "",
    experienceLevel: existingJob?.experience_level || "",
    requirements: existingJob?.requirements || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    const { data, errors } = validate(jobPostSchema, form);
    if (errors) return setErrors(errors);
    setErrors({});
    setSaving(true);

    const payload = {
      title: data.title,
      description: data.description,
      category_id: data.categoryId,
      city: data.city,
      job_type: data.jobType,
      salary_min: data.salaryMin || null,
      salary_max: data.salaryMax || null,
      experience_level: data.experienceLevel || null,
      requirements: data.requirements || null,
    };

    let error;
    if (isEdit) {
      // Editing resets status to pending so admin re-reviews changed content.
      ({ error } = await supabase.from("jobs").update({ ...payload, status: "pending" }).eq("id", existingJob.id));
    } else {
      ({ error } = await supabase.from("jobs").insert({ ...payload, employer_id: employerId, status: "pending" }));
    }

    setSaving(false);
    if (error) return toast("Could not save job. Please try again.", "error");
    toast(isEdit ? "Job updated — pending re-approval" : "Job submitted for admin approval!");
    router.push("/dashboard/employer/jobs");
    router.refresh();
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4">
      <div>
        <input placeholder="Job Title" className={inputClass} value={form.title} onChange={set("title")} />
        <FieldError message={errors.title} />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <select className={inputClass} value={form.categoryId} onChange={set("categoryId")}>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>
          <FieldError message={errors.categoryId} />
        </div>
        <div>
          <select className={inputClass} value={form.city} onChange={set("city")}>
            <option value="">Select City</option>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <FieldError message={errors.city} />
        </div>
        <select className={inputClass} value={form.jobType} onChange={set("jobType")}>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <input type="number" placeholder="Min Salary (PKR)" className={inputClass} value={form.salaryMin} onChange={set("salaryMin")} />
        <div>
          <input type="number" placeholder="Max Salary (PKR)" className={inputClass} value={form.salaryMax} onChange={set("salaryMax")} />
          <FieldError message={errors.salaryMax} />
        </div>
        <select className={inputClass} value={form.experienceLevel} onChange={set("experienceLevel")}>
          <option value="">Experience Level</option>
          {EXPERIENCE_LEVELS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div>
        <textarea rows={6} placeholder="Job description..." className={`${inputClass} resize-none`} value={form.description} onChange={set("description")} />
        <FieldError message={errors.description} />
      </div>

      <textarea rows={4} placeholder="Requirements (optional)" className={`${inputClass} resize-none`} value={form.requirements} onChange={set("requirements")} />

      <button
        onClick={submit}
        disabled={saving}
        className="w-full py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
      >
        {saving && <Spinner size={4} />}
        {isEdit ? "Update Job" : "Submit for Approval"}
      </button>
      <p className="text-xs text-gray-400 text-center">All job posts are reviewed by our admin team before going live.</p>
    </div>
  );
}
