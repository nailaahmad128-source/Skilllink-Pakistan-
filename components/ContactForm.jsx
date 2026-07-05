"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import { Spinner, FieldError } from "@/components/ui/Primitives";
import { contactSchema, validate } from "@/lib/validation";

const inputClass =
  "border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    const { data, errors } = validate(contactSchema, form);
    if (errors) return setErrors(errors);
    setErrors({});
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert(data);
    setLoading(false);
    if (error) return toast("Could not send message. Please try again or email us directly.", "error");
    toast("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
      <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-6">Send a Message</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input placeholder="Your Name" className={`w-full ${inputClass}`} value={form.name} onChange={set("name")} />
            <FieldError message={errors.name} />
          </div>
          <div>
            <input placeholder="Email" type="email" className={`w-full ${inputClass}`} value={form.email} onChange={set("email")} />
            <FieldError message={errors.email} />
          </div>
        </div>
        <div>
          <input placeholder="Subject" className={`w-full ${inputClass}`} value={form.subject} onChange={set("subject")} />
          <FieldError message={errors.subject} />
        </div>
        <div>
          <textarea rows={5} placeholder="Your message..." className={`w-full ${inputClass} resize-none`} value={form.message} onChange={set("message")} />
          <FieldError message={errors.message} />
        </div>
        <button
          onClick={submit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white text-sm transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}
        >
          {loading && <Spinner size={4} />}
          Send Message
        </button>
      </div>
    </div>
  );
}
