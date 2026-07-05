"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import { Spinner, FieldError, Avatar } from "@/components/ui/Primitives";
import { employerProfileSchema, validate } from "@/lib/validation";

const inputClass =
  "w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function EmployerProfileForm({ userId, initialEmployer }) {
  const [form, setForm] = useState({
    companyName: initialEmployer?.company_name || "",
    industry: initialEmployer?.industry || "",
    companySize: initialEmployer?.company_size || "",
    website: initialEmployer?.website || "",
    description: initialEmployer?.description || "",
    city: initialEmployer?.city || "",
  });
  const [logoUrl, setLogoUrl] = useState(initialEmployer?.logo_url || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const { toast } = useToast();
  const supabase = createClient();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const uploadLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast("Logo must be under 2MB", "error");
    if (!file.type.startsWith("image/")) return toast("Please upload an image file", "error");

    setUploading(true);
    const path = `${userId}/logo-${Date.now()}.${file.name.split(".").pop()}`;
    const { error: uploadError } = await supabase.storage.from("company-logos").upload(path, file, { upsert: true });
    if (uploadError) {
      setUploading(false);
      return toast("Logo upload failed", "error");
    }
    const { data } = supabase.storage.from("company-logos").getPublicUrl(path);
    await supabase.from("employer_profiles").update({ logo_url: data.publicUrl }).eq("id", userId);
    setLogoUrl(data.publicUrl);
    setUploading(false);
    toast("Logo updated");
  };

  const save = async () => {
    const { data, errors } = validate(employerProfileSchema, form);
    if (errors) return setErrors(errors);
    setErrors({});
    setSaving(true);
    const { error } = await supabase.from("employer_profiles").update({
      company_name: data.companyName,
      industry: data.industry || null,
      company_size: data.companySize || null,
      website: data.website || null,
      description: data.description || null,
      city: data.city || null,
    }).eq("id", userId);
    setSaving(false);
    if (error) return toast("Could not save. Please try again.", "error");
    toast("Company profile updated");
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
      <div className="flex items-center gap-4">
        {logoUrl ? (
          <img src={logoUrl} alt="Company logo" className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
        ) : (
          <Avatar initials={initials(form.companyName || "Co")} size="lg" />
        )}
        <div>
          <input ref={fileRef} type="file" accept="image/*" onChange={uploadLogo} className="hidden" />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1.5">
            {uploading && <Spinner size={3} />} {logoUrl ? "Change Logo" : "Upload Logo"}
          </button>
        </div>
      </div>

      <div>
        <input placeholder="Company Name" className={inputClass} value={form.companyName} onChange={set("companyName")} />
        <FieldError message={errors.companyName} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="Industry" className={inputClass} value={form.industry} onChange={set("industry")} />
        <select className={inputClass} value={form.companySize} onChange={set("companySize")}>
          <option value="">Company Size</option>
          {["1-10", "11-50", "51-200", "201-500", "500+"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <input placeholder="Website (https://...)" className={inputClass} value={form.website} onChange={set("website")} />
          <FieldError message={errors.website} />
        </div>
        <select className={inputClass} value={form.city} onChange={set("city")}>
          <option value="">City</option>
          {CITIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <textarea rows={4} placeholder="Company description" className={`${inputClass} resize-none`} value={form.description} onChange={set("description")} />

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
      >
        {saving && <Spinner size={4} />}
        Save Company Profile
      </button>
    </div>
  );
}
