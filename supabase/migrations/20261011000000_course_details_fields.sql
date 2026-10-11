-- =====================================================================
-- EduWay · Course details page: new course fields
--
--   learning_outcomes → "What you'll learn"   e.g. {"Build a responsive website", "..."}
--   requirements      → "Requirements" text   e.g. {"A computer with internet", "..."}
--
-- (course_requirements is a different thing: COURSES you must finish first)
--
-- Run once in Supabase → SQL Editor.
-- =====================================================================

alter table public.courses
  add column if not exists learning_outcomes text[] not null default '{}',
  add column if not exists requirements      text[] not null default '{}';

-- Teachers can only write the columns they were granted (see the courses migration),
-- so the new columns must be granted too, or the teacher dashboard can't fill them.
grant insert (learning_outcomes, requirements) on public.courses to authenticated;
grant update (learning_outcomes, requirements) on public.courses to authenticated;
