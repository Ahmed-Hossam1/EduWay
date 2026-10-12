-- =====================================================================
-- EduWay · Enrollments + lesson progress
--
--   profiles 1 ── N enrollments N ── 1 courses        "this user OWNS this course"
--   profiles 1 ── N lesson_progress N ── 1 lessons    "this user FINISHED this lesson"
--
-- Who creates enrollments:
--   - free course  → the user himself (browser → /api/enrollments), allowed by RLS
--   - paid course  → ONLY the server after a successful payment (checkout, next phase),
--                    using the service role key (RLS doesn't apply to it)
--
-- Run once in Supabase → SQL Editor.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. enrollments
-- ---------------------------------------------------------------------
create type public.enrollment_status as enum ('active', 'completed', 'refunded');

create table public.enrollments (
  user_id      uuid not null references public.profiles (id) on delete cascade,
  course_id    uuid not null references public.courses (id) on delete cascade,
  status       public.enrollment_status not null default 'active',
  enrolled_at  timestamptz not null default now(),
  completed_at timestamptz,                  -- filled when all lessons are done (lesson player phase)

  primary key (user_id, course_id)           -- a user owns a course only once
);

create index enrollments_user_enrolled_idx on public.enrollments (user_id, enrolled_at desc);  -- "My courses"
create index enrollments_course_id_idx     on public.enrollments (course_id);                  -- teacher: "my students"


-- ---------------------------------------------------------------------
-- 2. lesson_progress  (a row = the lesson is completed; no row = not completed)
-- ---------------------------------------------------------------------
create table public.lesson_progress (
  user_id      uuid not null references public.profiles (id) on delete cascade,
  lesson_id    uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),

  primary key (user_id, lesson_id)
);

create index lesson_progress_lesson_id_idx on public.lesson_progress (lesson_id);


-- ---------------------------------------------------------------------
-- 3. Trigger: enrolling → students_count + 1 (unenrolling → - 1)
--    It ADDS to the current number (the seed numbers stay until launch).
-- ---------------------------------------------------------------------
create or replace function public.enrollments_update_students_count()
returns trigger
language plpgsql
security definer          -- the student can't update courses himself, the trigger can
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.courses set students_count = students_count + 1 where id = new.course_id;
  elsif tg_op = 'DELETE' then
    update public.courses set students_count = greatest(students_count - 1, 0) where id = old.course_id;
  end if;
  return null;
end;
$$;

create trigger enrollments_update_students_count
  after insert or delete on public.enrollments
  for each row execute function public.enrollments_update_students_count();


-- ---------------------------------------------------------------------
-- 4. Trigger: enrolling → remove the course from the user's cart and wishlist
--    (works for every way of enrolling: free enroll now, checkout later)
-- ---------------------------------------------------------------------
create or replace function public.enrollments_clean_cart_and_wishlist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.cart_items     where user_id = new.user_id and course_id = new.course_id;
  delete from public.wishlist_items where user_id = new.user_id and course_id = new.course_id;
  return null;
end;
$$;

create trigger enrollments_clean_cart_and_wishlist
  after insert on public.enrollments
  for each row execute function public.enrollments_clean_cart_and_wishlist();


-- ---------------------------------------------------------------------
-- 5. RLS: enrollments
-- ---------------------------------------------------------------------
alter table public.enrollments enable row level security;

-- the student sees his enrollments, the teacher sees the enrollments of his courses
create policy "students and course teachers read enrollments"
  on public.enrollments for select
  using (
    user_id = auth.uid()
    or exists (select 1 from public.courses c where c.id = course_id and c.instructor_id = auth.uid())
  );

-- from the browser: only FREE published courses, and not your own course
create policy "users enroll themselves in free published courses"
  on public.enrollments for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.courses c
      where c.id = course_id
        and c.status = 'published'
        and c.price = 0
        and c.instructor_id <> auth.uid()
    )
  );

-- no update / delete policies: status changes and refunds are done by the server


-- ---------------------------------------------------------------------
-- 6. RLS: lesson_progress (only for lessons of a course you are enrolled in)
-- ---------------------------------------------------------------------
alter table public.lesson_progress enable row level security;

create policy "users read their own progress"
  on public.lesson_progress for select
  using (user_id = auth.uid());

create policy "enrolled users mark their lessons as completed"
  on public.lesson_progress for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.lessons l
      join public.sections s on s.id = l.section_id
      join public.enrollments e on e.course_id = s.course_id
      where l.id = lesson_id and e.user_id = auth.uid() and e.status <> 'refunded'
    )
  );

create policy "users unmark their own lessons"
  on public.lesson_progress for delete
  using (user_id = auth.uid());


-- ---------------------------------------------------------------------
-- 7. Cart + wishlist: you can't add a course you already own
--    (replaces the insert policies from the cart / wishlist migrations)
-- ---------------------------------------------------------------------
drop policy "users add paid published courses to their own cart" on public.cart_items;

create policy "users add paid courses they don't own to their cart"
  on public.cart_items for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.courses c
      where c.id = course_id and c.status = 'published' and c.price > 0
    )
    and not exists (
      select 1 from public.enrollments e
      where e.user_id = auth.uid() and e.course_id = cart_items.course_id
    )
  );

drop policy "users add published courses to their own wishlist" on public.wishlist_items;

create policy "users add courses they don't own to their wishlist"
  on public.wishlist_items for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
    and not exists (
      select 1 from public.enrollments e
      where e.user_id = auth.uid() and e.course_id = wishlist_items.course_id
    )
  );
