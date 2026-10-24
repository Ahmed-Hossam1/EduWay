-- =====================================================================
-- EduWay · Migration 3 of the "backend in the database" refactor
-- The teacher dashboard lists, the notifications bell, the logged-in profile.
--
-- Before: getTeacherRecentSales used the ADMIN client (service role) to get around the orders RLS,
--         the dashboard lists cast nested joins with "as unknown as", the bell made 2 queries
--         + renamed the columns, and /api/auth/me flattened instructor_profiles in TypeScript.
-- Now:    each one is a database function that returns the exact shape the frontend uses.
--
--   public.get_teacher_recent_sales(p_limit)   → [RecentSale, ...]   (his last paid sales)
--   public.get_teacher_new_students(p_limit)   → [NewStudent, ...]   (his last enrollments)
--   public.get_my_notifications(p_limit)       → { items: [...], unreadCount }
--   public.get_my_profile()                    → ProfileSummary | null
--
-- No user-id parameter: every function works on (select auth.uid()) = the logged-in user.
-- Logged-in users only (revoked from anon).
--
-- Run once in Supabase → SQL Editor.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1) get_teacher_recent_sales: the last paid sales of the logged-in teacher's courses (newest first)
--    → [{ order_id, course_id, price,
--         order:  { id, status, paid_at, buyer: { first_name, last_name } | null },
--         course: { id, title, thumbnail_url, instructor_id } }]
--
--    security DEFINER: the orders RLS lets only the BUYER read his order, not the teacher.
--    ⚠️ So "c.instructor_id = auth.uid()" IS the security: a teacher sees only the sales of HIS courses,
--    and only the buyer's name (no email, no other order data).
-- ---------------------------------------------------------------------
create or replace function public.get_teacher_recent_sales(p_limit integer default 5)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with sales as (
    select oi.order_id, oi.course_id, oi.price,
           o.status, o.paid_at,
           buyer.first_name as buyer_first_name, buyer.last_name as buyer_last_name, buyer.id as buyer_id,
           c.title, c.thumbnail_url, c.instructor_id
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    join public.courses c on c.id = oi.course_id
    left join public.profiles buyer on buyer.id = o.user_id
    where c.instructor_id = (select auth.uid())
      and o.status = 'paid'
      and o.paid_at is not null
    order by o.paid_at desc, oi.order_id, oi.course_id
    limit greatest(p_limit, 0)
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'order_id', s.order_id,
        'course_id', s.course_id,
        'price', s.price,
        'order', jsonb_build_object(
          'id', s.order_id,
          'status', s.status,
          'paid_at', s.paid_at,
          'buyer', case
            when s.buyer_id is null then null
            else jsonb_build_object('first_name', s.buyer_first_name, 'last_name', s.buyer_last_name)
          end
        ),
        'course', jsonb_build_object(
          'id', s.course_id,
          'title', s.title,
          'thumbnail_url', s.thumbnail_url,
          'instructor_id', s.instructor_id
        )
      )
      order by s.paid_at desc, s.order_id, s.course_id
    ),
    '[]'::jsonb
  )
  from sales s;
$$;

revoke execute on function public.get_teacher_recent_sales(integer) from public, anon;
grant execute on function public.get_teacher_recent_sales(integer) to authenticated;


-- ---------------------------------------------------------------------
-- 2) get_teacher_new_students: the last students who joined the logged-in teacher's courses
--    → [{ user_id, course_id, enrolled_at,
--         student: { first_name, last_name, avatar_url } | null,
--         course:  { id, title, instructor_id } }]
--    security invoker: the enrollments RLS already lets a teacher read his students' rows.
-- ---------------------------------------------------------------------
create or replace function public.get_teacher_new_students(p_limit integer default 5)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with students as (
    select e.user_id, e.course_id, e.enrolled_at,
           st.id as student_id, st.first_name, st.last_name, st.avatar_url,
           c.title, c.instructor_id
    from public.enrollments e
    join public.courses c on c.id = e.course_id
    left join public.profiles st on st.id = e.user_id
    where c.instructor_id = (select auth.uid())
    order by e.enrolled_at desc, e.user_id, e.course_id
    limit greatest(p_limit, 0)
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'user_id', s.user_id,
        'course_id', s.course_id,
        'enrolled_at', s.enrolled_at,
        'student', case
          when s.student_id is null then null
          else jsonb_build_object('first_name', s.first_name, 'last_name', s.last_name, 'avatar_url', s.avatar_url)
        end,
        'course', jsonb_build_object('id', s.course_id, 'title', s.title, 'instructor_id', s.instructor_id)
      )
      order by s.enrolled_at desc, s.user_id, s.course_id
    ),
    '[]'::jsonb
  )
  from students s;
$$;

revoke execute on function public.get_teacher_new_students(integer) from public, anon;
grant execute on function public.get_teacher_new_students(integer) to authenticated;


-- ---------------------------------------------------------------------
-- 3) get_my_notifications: the latest notifications of the logged-in user + how many are unread
--    → { "items": [{ id, type, title, link, readAt, createdAt }, ...], "unreadCount": 3 }
--    (one call instead of two; the names are already the ones the UI uses)
-- ---------------------------------------------------------------------
create or replace function public.get_my_notifications(p_limit integer default 10)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'items', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', n.id,
            'type', n.type,
            'title', n.title,
            'link', n.link,
            'readAt', n.read_at,
            'createdAt', n.created_at
          )
          order by n.created_at desc, n.id
        )
        from (
          select *
          from public.notifications
          where user_id = (select auth.uid())
          order by created_at desc, id
          limit greatest(p_limit, 0)
        ) n
      ),
      '[]'::jsonb
    ),
    'unreadCount', (
      select count(*)::integer
      from public.notifications
      where user_id = (select auth.uid())
        and read_at is null
    )
  );
$$;

revoke execute on function public.get_my_notifications(integer) from public, anon;
grant execute on function public.get_my_notifications(integer) to authenticated;


-- ---------------------------------------------------------------------
-- 4) get_my_profile: the logged-in user for the Navbar / menus (/api/auth/me)
--    → { id, first_name, last_name, avatar_url, role, status, headline }
--      headline = the teacher headline (null for a student, or a teacher who didn't fill it)
--    No profile row → null (the route answers 404).
-- ---------------------------------------------------------------------
create or replace function public.get_my_profile()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'id', pr.id,
    'first_name', pr.first_name,
    'last_name', pr.last_name,
    'avatar_url', pr.avatar_url,
    'role', pr.role,
    'status', pr.status,
    'headline', ip.headline
  )
  from public.profiles pr
  left join public.instructor_profiles ip on ip.profile_id = pr.id
  where pr.id = (select auth.uid());
$$;

revoke execute on function public.get_my_profile() from public, anon;
grant execute on function public.get_my_profile() to authenticated;
