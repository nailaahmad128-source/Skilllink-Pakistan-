"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/context/ToastContext";
import { Spinner } from "@/components/ui/Primitives";

export default function CityManager({ initialCities }) {
  const [cities, setCities] = useState(initialCities);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const add = async () => {
    if (!name.trim()) return toast("Enter a city name", "error");
    setSaving(true);
    const { data, error } = await supabase.from("cities").insert({ name: name.trim(), sort_order: cities.length + 1 }).select().single();
    setSaving(false);
    if (error) return toast("Could not add city (may already exist)", "error");
    setCities((prev) => [...prev, data]);
    setName("");
    toast("City added");
    router.refresh();
  };

  const remove = async (id) => {
    if (!confirm("Delete this city?")) return;
    const { error } = await supabase.from("cities").delete().eq("id", id);
    if (error) return toast("Could not delete city", "error");
    setCities((prev) => prev.filter((c) => c.id !== id));
    toast("City deleted");
    router.refresh();
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">📍 Cities</h3>
      <div className="flex gap-2 mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New city name"
          className="flex-1 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button onClick={add} disabled={saving} className="px-4 py-2 rounded-xl font-bold text-white text-sm flex items-center gap-2" style={{ background: "linear-gradient(135deg, #0C6B38, #1B4F8A)" }}>
          {saving && <Spinner size={4} />} Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {cities.map((c) => (
          <span key={c.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300">
            {c.name}
            <button onClick={() => remove(c.id)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
          </span>
        ))}
      </div>
    </div>
  );
}
