-- =====================================================================
-- SkillLink Pakistan — Production Database Schema
-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)
-- =====================================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";

-- ---------- ENUM TYPES ----------
create type user_role as enum ('seeker', 'employer', 'admin');
create type approval_status as enum ('pending', 'approved', 'rejected');
create type job_type as enum ('Full Time', 'Part Time', 'Contract', 'Remote', 'Overseas');
create type application_status as enum ('applied', 'reviewed', 'shortlisted', 'rejected', 'hired');
create type notification_type as enum ('application_received', 'application_status', 'job_approved', 'job_rejected', 'employer_approved', 'employer_rejected', 'account_status', 'general');

-- =====================================================================
-- PROFILES  (1:1 with auth.users)
-- =====================================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'seeker',
  full_name text not null,
  phone text,
  avatar_url text,
  account_status approval_status not null default 'approved', -- seekers auto-approved; employers gated separately
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- CATEGORIES & CITIES (lookup tables, admin-managed)
-- =====================================================================
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  label text not null unique,
  icon text not null default '💼',
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  sort_order int not null default 0
);

-- =====================================================================
-- EMPLOYER PROFILES
-- =====================================================================
create table public.employer_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  industry text,
  company_size text,
  website text,
  description text,
  logo_url text,
  city text,
  verification_status approval_status not null default 'pending',
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- SEEKER PROFILES
-- =====================================================================
create table public.seeker_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  bio text,
  city text,
  experience_years int default 0,
  education text,
  skills text[] default '{}',
  cv_url text,
  cv_filename text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- JOBS
-- =====================================================================
create table public.jobs (
  id uuid primary key default uuid_generate_v4(),
  employer_id uuid not null references public.employer_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category_id uuid references public.categories(id),
  city text not null,
  job_type job_type not null default 'Full Time',
  salary_min int,
  salary_max int,
  experience_level text,
  requirements text,
  status approval_status not null default 'pending',
  rejection_reason text,
  is_hot boolean not null default false,
  views int not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index jobs_status_idx on public.jobs(status);
create index jobs_city_idx on public.jobs(city);
create index jobs_category_idx on public.jobs(category_id);
create index jobs_employer_idx on public.jobs(employer_id);
create index jobs_created_idx on public.jobs(created_at desc);

-- Full text search
alter table public.jobs add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(description,'')), 'B')
  ) stored;
create index jobs_search_idx on public.jobs using gin(search_vector);

-- =====================================================================
-- APPLICATIONS
-- =====================================================================
create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  seeker_id uuid not null references public.seeker_profiles(id) on delete cascade,
  cover_letter text,
  cv_url_snapshot text,
  status application_status not null default 'applied',
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(job_id, seeker_id)
);

create index applications_job_idx on public.applications(job_id);
create index applications_seeker_idx on public.applications(seeker_id);

-- =====================================================================
-- SAVED JOBS
-- =====================================================================
create table public.saved_jobs (
  id uuid primary key default uuid_generate_v4(),
  seeker_id uuid not null references public.seeker_profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(seeker_id, job_id)
);

-- =====================================================================
-- NOTIFICATIONS
-- =====================================================================
create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type notification_type not null default 'general',
  title text not null,
  message text not null,
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications(user_id, is_read);

-- =====================================================================
-- CONTACT MESSAGES (public contact form submissions)
-- =====================================================================
create table public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- (RLS + policies for contact_messages are set up later, in the ROW LEVEL SECURITY section)

-- =====================================================================
-- FUNCTION: auto-create profile row when a new auth user signs up
-- Reads role/full_name/phone/company_name from signup metadata
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  chosen_role user_role;
begin
  chosen_role := coalesce((new.raw_user_meta_data->>'role')::user_role, 'seeker');

  insert into public.profiles (id, role, full_name, phone, account_status)
  values (
    new.id,
    chosen_role,
    coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
    new.raw_user_meta_data->>'phone',
    case when chosen_role = 'employer' then 'pending'::approval_status else 'approved'::approval_status end
  );

  if chosen_role = 'seeker' then
    insert into public.seeker_profiles (id) values (new.id);
  elsif chosen_role = 'employer' then
    insert into public.employer_profiles (id, company_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'company_name', 'My Company'));
  end if;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
-- FUNCTION: notify employer when a new application arrives
-- =====================================================================
create or replace function public.notify_new_application()
returns trigger as $$
declare
  job_title text;
  employer_uid uuid;
  seeker_name text;
begin
  select j.title, j.employer_id into job_title, employer_uid from public.jobs j where j.id = new.job_id;
  select full_name into seeker_name from public.profiles where id = new.seeker_id;

  insert into public.notifications (user_id, type, title, message, link)
  values (
    employer_uid,
    'application_received',
    'New Application Received',
    seeker_name || ' applied for "' || job_title || '"',
    '/dashboard/employer/applications'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_application_created
  after insert on public.applications
  for each row execute procedure public.notify_new_application();

-- =====================================================================
-- FUNCTION: notify seeker when application status changes
-- =====================================================================
create or replace function public.notify_application_status()
returns trigger as $$
declare
  job_title text;
begin
  if new.status is distinct from old.status then
    select title into job_title from public.jobs where id = new.job_id;
    insert into public.notifications (user_id, type, title, message, link)
    values (
      new.seeker_id,
      'application_status',
      'Application Update',
      'Your application for "' || job_title || '" is now: ' || new.status,
      '/dashboard/seeker/applications'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_application_status_changed
  after update on public.applications
  for each row execute procedure public.notify_application_status();

-- =====================================================================
-- FUNCTION: notify employer when job approved/rejected
-- =====================================================================
create or replace function public.notify_job_status()
returns trigger as $$
begin
  if new.status is distinct from old.status and new.status in ('approved','rejected') then
    insert into public.notifications (user_id, type, title, message, link)
    values (
      new.employer_id,
      case when new.status = 'approved' then 'job_approved' else 'job_rejected' end,
      case when new.status = 'approved' then 'Job Approved' else 'Job Rejected' end,
      '"' || new.title || '" was ' || new.status || case when new.rejection_reason is not null then ': ' || new.rejection_reason else '' end,
      '/dashboard/employer/jobs'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_job_status_changed
  after update on public.jobs
  for each row execute procedure public.notify_job_status();

-- =====================================================================
-- FUNCTION: notify employer when verification approved/rejected
-- =====================================================================
create or replace function public.notify_employer_verification()
returns trigger as $$
begin
  if new.verification_status is distinct from old.verification_status and new.verification_status in ('approved','rejected') then
    insert into public.notifications (user_id, type, title, message, link)
    values (
      new.id,
      case when new.verification_status = 'approved' then 'employer_approved' else 'employer_rejected' end,
      case when new.verification_status = 'approved' then 'Account Verified' else 'Verification Rejected' end,
      case when new.verification_status = 'approved' then 'Your employer account has been verified. You can now post jobs.'
           else 'Your verification was rejected' || coalesce(': ' || new.rejection_reason, '.') end,
      '/dashboard/employer'
    );
    -- keep profiles.account_status in sync
    update public.profiles set account_status = new.verification_status where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_employer_verification_changed
  after update on public.employer_profiles
  for each row execute procedure public.notify_employer_verification();

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_profiles before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_updated_at_employer before update on public.employer_profiles for each row execute procedure public.set_updated_at();
create trigger set_updated_at_seeker before update on public.seeker_profiles for each row execute procedure public.set_updated_at();
create trigger set_updated_at_jobs before update on public.jobs for each row execute procedure public.set_updated_at();
create trigger set_updated_at_applications before update on public.applications for each row execute procedure public.set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.employer_profiles enable row level security;
alter table public.seeker_profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.notifications enable row level security;
alter table public.categories enable row level security;
alter table public.cities enable row level security;
alter table public.contact_messages enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer stable;

-- ---------- profiles ----------
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin());
create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());

-- ---------- categories / cities (public read, admin write) ----------
create policy "categories_public_read" on public.categories for select using (true);
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "cities_public_read" on public.cities for select using (true);
create policy "cities_admin_write" on public.cities for all using (public.is_admin()) with check (public.is_admin());

-- ---------- contact_messages ----------
create policy "contact_public_insert" on public.contact_messages
  for insert with check (true);
create policy "contact_admin_read" on public.contact_messages
  for select using (public.is_admin());
create policy "contact_admin_update" on public.contact_messages
  for update using (public.is_admin());

-- ---------- employer_profiles ----------
create policy "employer_public_read_approved" on public.employer_profiles
  for select using (verification_status = 'approved' or id = auth.uid() or public.is_admin());
create policy "employer_update_own_or_admin" on public.employer_profiles
  for update using (id = auth.uid() or public.is_admin());
create policy "employer_insert_self" on public.employer_profiles
  for insert with check (id = auth.uid());

-- ---------- seeker_profiles ----------
create policy "seeker_select_own_admin_or_employer_of_applicant" on public.seeker_profiles
  for select using (
    id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.seeker_id = seeker_profiles.id and j.employer_id = auth.uid()
    )
  );
create policy "seeker_update_own_or_admin" on public.seeker_profiles
  for update using (id = auth.uid() or public.is_admin());
create policy "seeker_insert_self" on public.seeker_profiles
  for insert with check (id = auth.uid());

-- ---------- jobs ----------
create policy "jobs_public_read_approved" on public.jobs
  for select using (
    status = 'approved'
    or employer_id = auth.uid()
    or public.is_admin()
  );
create policy "jobs_employer_insert_own" on public.jobs
  for insert with check (
    employer_id = auth.uid()
    and exists (select 1 from public.employer_profiles e where e.id = auth.uid() and e.verification_status = 'approved')
  );
create policy "jobs_employer_update_own_or_admin" on public.jobs
  for update using (employer_id = auth.uid() or public.is_admin());
create policy "jobs_employer_delete_own_or_admin" on public.jobs
  for delete using (employer_id = auth.uid() or public.is_admin());

-- ---------- applications ----------
create policy "applications_select_seeker_employer_admin" on public.applications
  for select using (
    seeker_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.jobs j where j.id = applications.job_id and j.employer_id = auth.uid())
  );
create policy "applications_seeker_insert_own" on public.applications
  for insert with check (
    seeker_id = auth.uid()
    and exists (select 1 from public.jobs j where j.id = job_id and j.status = 'approved')
  );
create policy "applications_update_employer_or_admin" on public.applications
  for update using (
    public.is_admin()
    or exists (select 1 from public.jobs j where j.id = applications.job_id and j.employer_id = auth.uid())
  );

-- ---------- saved_jobs ----------
create policy "saved_jobs_owner_only" on public.saved_jobs
  for all using (seeker_id = auth.uid() or public.is_admin())
  with check (seeker_id = auth.uid());

-- ---------- notifications ----------
create policy "notifications_owner_read" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());
create policy "notifications_owner_update" on public.notifications
  for update using (user_id = auth.uid());
create policy "notifications_system_insert" on public.notifications
  for insert with check (true);

-- =====================================================================
-- STORAGE BUCKETS
-- =====================================================================
insert into storage.buckets (id, name, public) values ('cvs', 'cvs', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('company-logos', 'company-logos', true)
  on conflict (id) do nothing;

-- CV storage: owner can manage their own folder (path prefix = user id); employers of applicants can read
create policy "cv_owner_all" on storage.objects for all
  using (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'cvs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "cv_employer_read_applicants" on storage.objects for select
  using (
    bucket_id = 'cvs'
    and exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where j.employer_id = auth.uid()
      and (storage.foldername(name))[1] = a.seeker_id::text
    )
  );

create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
create policy "avatars_owner_write" on storage.objects for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_update" on storage.objects for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "logos_public_read" on storage.objects for select using (bucket_id = 'company-logos');
create policy "logos_owner_write" on storage.objects for insert with check (bucket_id = 'company-logos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "logos_owner_update" on storage.objects for update using (bucket_id = 'company-logos' and (storage.foldername(name))[1] = auth.uid()::text);

-- =====================================================================
-- SEED DATA: categories & cities (matches original UI)
-- =====================================================================
insert into public.categories (label, icon, slug, sort_order) values
  ('Islamic Scholars & Madaris', '🕌', 'islamic-scholars', 1),
  ('Imams & Khateebs', '🎙️', 'imams-khateebs', 2),
  ('Quran Teachers & Huffaz', '📖', 'quran-teachers', 3),
  ('School Teachers', '🏫', 'school-teachers', 4),
  ('College & University', '🎓', 'college-university', 5),
  ('Doctors & Healthcare', '🏥', 'doctors-healthcare', 6),
  ('Engineers', '⚙️', 'engineers', 7),
  ('IT & Software', '💻', 'it-software', 8),
  ('Government Jobs', '🏛️', 'government-jobs', 9),
  ('Private Companies', '🏢', 'private-companies', 10),
  ('Banking & Finance', '🏦', 'banking-finance', 11),
  ('Sales & Marketing', '📢', 'sales-marketing', 12),
  ('Freelancing', '🌐', 'freelancing', 13),
  ('Overseas Jobs', '✈️', 'overseas-jobs', 14),
  ('Other Professions', '🔧', 'other-professions', 15)
on conflict do nothing;

insert into public.cities (name, sort_order) values
  ('Karachi',1),('Lahore',2),('Islamabad',3),('Rawalpindi',4),('Faisalabad',5),
  ('Multan',6),('Peshawar',7),('Quetta',8),('Sialkot',9),('Gujranwala',10)
on conflict do nothing;

-- =====================================================================
-- NOTE: To create your first admin user:
-- 1. Sign up normally through the app (as a seeker or employer).
-- 2. Then run: update public.profiles set role = 'admin', account_status = 'approved' where id = '<user-uuid>';
-- =====================================================================
