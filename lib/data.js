import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data || [];
}

export async function getCities() {
  const supabase = createClient();
  const { data } = await supabase.from("cities").select("*").order("sort_order");
  return data || [];
}

export async function getCategoryJobCounts() {
  const supabase = createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");
  const { data: jobs } = await supabase.from("jobs").select("category_id").eq("status", "approved");
  const counts = {};
  (jobs || []).forEach((j) => {
    counts[j.category_id] = (counts[j.category_id] || 0) + 1;
  });
  return (categories || []).map((c) => ({ ...c, count: counts[c.id] || 0 }));
}

export async function getFeaturedJobs(limit = 6) {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, employer_profiles(company_name, logo_url), categories(label, icon)")
    .eq("status", "approved")
    .order("is_hot", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getTopEmployers(limit = 6) {
  const supabase = createClient();
  const { data: employers } = await supabase
    .from("employer_profiles")
    .select("id, company_name, industry, logo_url")
    .eq("verification_status", "approved")
    .limit(limit);

  if (!employers?.length) return [];

  const { data: jobs } = await supabase.from("jobs").select("employer_id").eq("status", "approved");
  const jobCounts = {};
  (jobs || []).forEach((j) => (jobCounts[j.employer_id] = (jobCounts[j.employer_id] || 0) + 1));

  return employers.map((e) => ({ ...e, jobCount: jobCounts[e.id] || 0 }));
}

export async function searchJobs({
  keyword = "",
  city = "",
  categoryIds = [],
  jobTypes = [],
  salaryMin,
  experienceLevel,
  page = 1,
  pageSize = 10,
  sort = "recent",
} = {}) {
  const supabase = createClient();
  let query = supabase
    .from("jobs")
    .select("*, employer_profiles(company_name, logo_url), categories(label, icon)", { count: "exact" })
    .eq("status", "approved");

  if (keyword) query = query.textSearch("search_vector", keyword.trim().split(/\s+/).join(" & "));
  if (city && city !== "All Pakistan") query = query.eq("city", city);
  if (categoryIds.length) query = query.in("category_id", categoryIds);
  if (jobTypes.length) query = query.in("job_type", jobTypes);
  if (salaryMin) query = query.gte("salary_max", salaryMin);
  if (experienceLevel) query = query.eq("experience_level", experienceLevel);

  if (sort === "salary_high") query = query.order("salary_max", { ascending: false, nullsFirst: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  return { jobs: data || [], total: count || 0, error };
}

export async function getJobById(id) {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, employer_profiles(id, company_name, logo_url, industry, website, description), categories(label, icon)")
    .eq("id", id)
    .single();
  return data;
}
