"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import { Spinner, FieldError } from "@/components/ui/Primitives";
import { seekerProfileSchema, validate } from "@/lib/validation";

const inputClass =
  "w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];

export default function SeekerProfileForm({ userId, initialProfile, initialAccount }) {
  const [form, setForm] = useState({
    headline: initialProfile?.headline || "",
    bio: initialProfile?.bio || "",
    city: initialProfile?.city || "",
    experienceYears: initialProfile?.experience_years ?? 0,
    education: initialProfile?.education || "",
    skills: (initialProfile?.skills || []).join(", "),
    linkedinUrl: initialProfile?.linkedin_url || "",
  });
  const [fullName, setFullName] = useState(initialAccount?.full_name || "");
  const [phone, setPhone] = useState(initialAccount?.phone || "");
  const [cvUrl, setCvUrl] = useState(initialProfile?.cv_url || "");
  const [cvFilename, setCvFilename] = useState(initialProfile?.cv_filename || "");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const { toast } = useToast();
  const supabase = createClient();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast("CV file must be under 5MB", "error");
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) return toast("Please upload a PDF or Word document", "error");

    setUploading(true);
    const path = `${userId}/cv-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("cvs").upload(path, file, { upsert: true });
    if (uploadError) {
      setUploading(false);
      return toast("CV upload failed. Please try again.", "error");
    }
    const { data: signed } = await supabase.storage.from("cvs").createSignedUrl(path, 60 * 60 * 24 * 365);
    await supabase.from("seeker_profiles").update({ cv_url: path, cv_filename: file.name }).eq("id", userId);
    setCvUrl(path);
    setCvFilename(file.name);
    setUploading(false);
    toast("CV uploaded successfully");
  };

  const save = async () => {
    const payload = {
      headline: form.headline,
      bio: form.bio,
      city: form.city,
      experienceYears: form.experienceYears,
      education: form.education,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      linkedinUrl: form.linkedinUrl,
    };
    const { data, errors } = validate(seekerProfileSchema, payload);
    if (errors) return setErrors(errors);
    setErrors({});
    setSaving(true);

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("seeker_profiles").update({
        headline: data.headline || null,
        bio: data.bio || null,
        city: data.city,
        experience_years: data.experienceYears ?? 0,
        education: data.education || null,
        skills: data.skills,
        linkedin_url: data.linkedinUrl || null,
      }).eq("id", userId),
      supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", userId),
    ]);

    setSaving(false);
    if (e1 || e2) return toast("Could not save profile. Please try again.", "error");
    toast("Profile updated successfully");
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
      <div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Basic Information</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input placeholder="Full Name" className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input placeholder="Phone Number" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">Professional Profile</h3>
        <div className="space-y-3">
          <input placeholder="Headline (e.g. Senior Software Engineer)" className={inputClass} value={form.headline} onChange={set("headline")} />
          <textarea rows={4} placeholder="Short bio / summary" className={`${inputClass} resize-none`} value={form.bio} onChange={set("bio")} />
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <select className={inputClass} value={form.city} onChange={set("city")}>
                <option value="">Select City</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <FieldError message={errors.city} />
            </div>
            <input type="number" min="0" placeholder="Years of Experience" className={inputClass} value={form.experienceYears} onChange={set("experienceYears")} />
          </div>
          <input placeholder="Education (e.g. BS Computer Science, LUMS)" className={inputClass} value={form.education} onChange={set("education")} />
          <input placeholder="Skills (comma separated: React, Node.js, SQL)" className={inputClass} value={form.skills} onChange={set("skills")} />
          <div>
            <input placeholder="LinkedIn URL (optional)" className={inputClass} value={form.linkedinUrl} onChange={set("linkedinUrl")} />
            <FieldError message={errors.linkedinUrl} />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">CV / Resume</h3>
        {cvUrl && (
          <div className="flex items-center gap-2 mb-3 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 rounded-lg px-3 py-2">
            📄 {cvFilename || "CV uploaded"}
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-green-400 transition flex items-center gap-2"
        >
          {uploading && <Spinner size={4} />}
          {cvUrl ? "Replace CV" : "Upload CV"} (PDF or Word, max 5MB)
        </button>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
      >
        {saving && <Spinner size={4} />}
        Save Profile
      </button>
    </div>
  );
}
