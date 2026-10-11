-- =====================================================================
-- EduWay · Seed: instructor profiles (SAMPLE data for development)
--
-- Gives every teacher that has no instructor profile yet a sample profile,
-- so the course details page and the instructor page have something to show.
-- Edit the text later from the teacher dashboard / Table Editor.
--
-- Run AFTER migration 20261012000000_create_instructor_profiles.sql.
-- Safe to run more than once.
-- =====================================================================

insert into public.instructor_profiles (
  profile_id, headline, bio, experience_level, skills, teaching_languages
)
select
  p.id,
  'Software Engineer & Online Instructor',
  'I build web applications and love turning complex topics into simple, practical lessons. '
    || 'My courses focus on real projects you can add to your portfolio.'
    || E'\n\n'
    || 'Before teaching on EduWay I worked on frontend and backend projects for startups and agencies.',
  'expert',
  array['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'SQL'],
  array['English', 'Arabic']
from public.profiles p
where p.role = 'teacher'
on conflict (profile_id) do nothing;
