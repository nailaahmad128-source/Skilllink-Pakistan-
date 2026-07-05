"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import { Spinner } from "@/components/ui/Primitives";

export default function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("💼");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const add = async () => {
    if (!label.trim()) return toast("Enter a category name", "error");
    setSaving(true);
    const slug = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const { data, error } = await supabase
      .from("categories")
      .insert({ label: label.trim(), icon, slug, sort_order: categories.length + 1 })
      .select()
      .single();
    setSaving(false);
    if (error) return toast("Could not add category (name may already exist)", "error");
    setCategories((prev) => [...prev, data]);
    setLabel("");
    toast("Category added");
    router.refresh();
  };

  const remove = async (id) => {
    if (!confirm("Delete this category? Jobs using it will keep their data but show as uncategorized.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast("Could not delete category", "error");
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast("Category deleted");
    router.refresh();
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">📂 Job Categories</h3>
      <div className="flex gap-2 mb-4">
        <input
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-14 text-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-2 py-2 text-sm"
          maxLength={2}
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="New category name"
          className="flex-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button onClick={add} disabled={saving} className="px-4 py-2 rounded-xl font-bold text-white text-sm flex items-center gap-2" style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}>
          {saving && <Spinner size={4} />} Add
        </button>
      </div>
      <div className="space-y-1.5 max-h-96 overflow-y-auto">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900">
            <span className="text-sm text-gray-700 dark:text-gray-300">{c.icon} {c.label}</span>
            <button onClick={() => remove(c.id)} className="text-xs text-red-600 hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
