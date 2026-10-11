-- =====================================================================
-- EduWay · Instructor profiles
--
--   profiles (name, photo, role)  1 ── 1  instructor_profiles (headline, bio, skills, links, ...)
--   instructor_profiles           1 ── N  instructor_certifications
--
-- The fields match what the teacher fills in the onboarding steps.
-- Run once in Supabase → SQL Editor.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Experience levels (same ids as the onboarding "Experience" step)
--    beginner = 1–2 years · intermediate = 3–5 · expert = 5–10 · veteran = 10+
-- ---------------------------------------------------------------------
create type public.instructor_experience as enum ('beginner', 'intermediate', 'expert', 'veteran');


-- ---------------------------------------------------------------------
-- 2. instructor_profiles  (one row per teacher, same id as profiles.id)
-- ---------------------------------------------------------------------
create table public.instructor_profiles (
  profile_id         uuid primary key references public.profiles (id) on delete cascade,

  headline           text check (char_length(headline) <= 120),   -- "Senior Frontend Developer"
  bio                text check (char_length(bio) <= 2000),
  experience_level   public.instructor_experience,
  skills             text[] not null default '{}',                -- {"React", "Next.js"}
  teaching_languages text[] not null default '{}',                -- {"English", "Arabic"}

  linkedin_url       text,
  website_url        text,   -- portfolio / personal website
  github_url         text,
  twitter_url        text,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create trigger instructor_profiles_set_updated_at
  before update on public.instructor_profiles
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------
-- 3. instructor_certifications  (a teacher can have many)
-- ---------------------------------------------------------------------
create table public.instructor_certifications (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.instructor_profiles (profile_id) on delete cascade,
  name        text not null,                                       -- "Meta Frontend Certificate"
  issuer      text,                                                -- "Meta / Coursera"
  year        integer check (year between 1950 and 2100),
  created_at  timestamptz not null default now()
);

create index instructor_certifications_profile_id_idx on public.instructor_certifications (profile_id);


-- ---------------------------------------------------------------------
-- 4. Row Level Security
--
--   Everyone : reads the profile of APPROVED teachers (public instructor page)
--   Teacher  : reads / creates / updates only HIS OWN profile (even before approval)
-- ---------------------------------------------------------------------
create or replace function public.is_approved_teacher_id(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = p_profile_id and role = 'teacher' and status = 'approved'
  );
$$;

alter table public.instructor_profiles       enable row level security;
alter table public.instructor_certifications enable row level security;

-- instructor_profiles
create policy "approved instructors are public, owners see their own"
  on public.instructor_profiles for select
  using (public.is_approved_teacher_id(profile_id) or profile_id = auth.uid());

create policy "teachers create their own instructor profile"
  on public.instructor_profiles for insert
  with check (
    profile_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher')
  );

create policy "teachers update their own instructor profile"
  on public.instructor_profiles for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- instructor_certifications: follow the parent profile
create policy "certifications follow instructor profile visibility"
  on public.instructor_certifications for select
  using (public.is_approved_teacher_id(profile_id) or profile_id = auth.uid());

create policy "teachers manage their own certifications"
  on public.instructor_certifications for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
