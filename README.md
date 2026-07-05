# SkillLink Pakistan — Production Job Portal

A full-stack job portal built with **Next.js 14 (App Router)** and **Supabase** (Postgres + Auth + Storage + Row Level Security). Same visual design, colors, and branding as the original — now with a real backend.

## ✅ What's included

- **Auth**: Sign up, login, logout, forgot/reset password, optional Google/LinkedIn OAuth
- **Roles**: Job Seeker, Employer, Admin — each with a dedicated dashboard
- **Employers**: register → admin-verified → post/edit/delete jobs → manage applicants
- **Job Seekers**: profile + CV upload, apply to jobs, track application status, save jobs
- **Admin**: approve/reject employers and job posts, manage users, manage categories/cities
- **Search & filters**: keyword, city, category, job type, salary, sort — server-rendered, URL-driven
- **Notifications**: real-time in-app notifications (new applications, status changes, approvals) via Postgres triggers + Supabase Realtime
- **Security**: Row Level Security on every table, Zod validation on every form, private CV storage bucket
- **SEO**: per-page metadata, semantic HTML, server-rendered content
- Fully responsive, dark mode preserved

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → **Run**.
   This creates all tables, RLS policies, triggers, storage buckets, and seed data (categories & cities).
3. Go to **Authentication → URL Configuration** and set your Site URL (e.g. `https://yourapp.vercel.app`) and add `/auth/callback` and `/reset-password` as redirect URLs.
4. (Optional) Go to **Authentication → Providers** to enable Google / LinkedIn OIDC if you want social login.
5. Copy your **Project URL** and **anon public key** from **Settings → API**.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 4. Create your first admin

There's no public "admin signup" — this is intentional for security. To create one:

1. Register a normal account through the app (as a seeker or employer).
2. In Supabase **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'admin', account_status = 'approved' where id = '<user-uuid>';
   ```
   (Find the UUID in **Authentication → Users**.)
3. Sign out and back in. You'll now see the Admin dashboard at `/dashboard/admin`.

## 5. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import it into [Vercel](https://vercel.com/new).
3. In **Project Settings → Environment Variables**, add the variables below for **all three environments** (Production, Preview, Development), then redeploy:

   | Variable | Required | Notes |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Yes | From Supabase **Settings → API** |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | From Supabase **Settings → API** |
   | `NEXT_PUBLIC_SITE_URL` | Yes | Your production URL, e.g. `https://yourapp.vercel.app` |
   | `SUPABASE_SERVICE_ROLE_KEY` | No | Only needed if you add server-side admin scripts. Never expose to the client. |

4. Deploy. Update your Supabase Auth redirect URLs (**Authentication → URL Configuration**) to match the production domain.

### Troubleshooting: build fails with a `@supabase/ssr` error

If `next build` fails on Vercel with an error thrown from inside `@supabase/ssr` (something like *"Your project's URL and Key are required..."*), it means the environment variables above weren't set on the Vercel project **before** the build ran. `AuthProvider` (used in the root layout, so it's part of every page) creates a Supabase browser client, and Next.js pre-renders pages — including the default `/404` page — during the build; without the env vars that client creation throws and takes the whole build down with it.

This project guards against that: `lib/supabase/client.js`, `server.js`, and `middleware.js` all check `lib/supabase/env.js` first and fall back to an inert stub client on the server if the env vars aren't set, so a missing/misconfigured project degrades gracefully (empty data, logged-out state) instead of crashing the build or the whole site. In the browser, a real misconfiguration still throws immediately so it's obvious during development. Once the real env vars are set in Vercel, everything works normally — just make sure they're added **before** you trigger the deploy (or redeploy after adding them).

## Project structure

```
app/                    Next.js App Router pages
  (public pages)        /, /jobs, /jobs/[id], /categories, /employers, /about, /contact, /faq
  /login, /register, /forgot-password, /reset-password
  /dashboard/seeker/*    Job seeker dashboard
  /dashboard/employer/*  Employer dashboard
  /auth/callback         OAuth/email confirmation handler
components/             UI components (organized by feature)
context/                AuthContext, ToastContext
hooks/                  useSavedJobs, useNotifications
lib/                    Supabase clients, data fetching, validation, auth guard
supabase/schema.sql     Full database schema — run this first
middleware.js           Session refresh middleware
```

## Notes on things that need real-world configuration

- **WhatsApp number**: update `WHATSAPP_NUMBER` in `components/WhatsAppButton.jsx`.
- **Contact email/phone**: update the hardcoded values in `app/contact/page.js`.
- **Email templates**: Supabase sends default auth emails (confirmation, password reset). Customize them under **Authentication → Email Templates** in your Supabase dashboard for branded emails.
- **File size limits**: CVs are capped at 5MB, logos at 2MB (enforced client-side — for hard limits also set bucket file size limits in Supabase Storage settings).
