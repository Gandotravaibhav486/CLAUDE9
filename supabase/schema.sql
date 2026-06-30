-- Run this once in the Supabase SQL editor for this project.

-- profiles: one row per auth user, created client-side on first login
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- documents: both analyzed contracts and (future) created documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('analyzed', 'created')),
  title text,
  perspective text,
  overall_risk text,
  clause_count int,
  results jsonb,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table documents enable row level security;

drop policy if exists "own profile select" on profiles;
drop policy if exists "own profile upsert" on profiles;
drop policy if exists "own profile update" on profiles;
drop policy if exists "admin profile select" on profiles;

create policy "own profile select" on profiles for select using (auth.uid() = id);
create policy "own profile upsert" on profiles for insert with check (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);
create policy "admin profile select" on profiles for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
);

drop policy if exists "own documents select" on documents;
drop policy if exists "own documents insert" on documents;
drop policy if exists "admin documents select" on documents;

create policy "own documents select" on documents for select using (auth.uid() = user_id);
create policy "own documents insert" on documents for insert with check (auth.uid() = user_id);
create policy "admin documents select" on documents for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
);

-- feedback table already exists (created outside this schema file) with RLS enabled
-- and an "allow anon insert" policy. It's missing overall_risk, which
-- FeedbackForm.jsx already inserts and Admin.jsx reads — add it:
alter table feedback add column if not exists overall_risk text;

-- admins need read access; the existing "allow anon insert" policy only covers inserts
drop policy if exists "admin feedback select" on feedback;
create policy "admin feedback select" on feedback for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.is_admin)
);

-- After running this file, set yourself as admin manually:
-- update profiles set is_admin = true where email = 'you@example.com';
