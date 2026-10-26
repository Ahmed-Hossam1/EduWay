-- =====================================================================
-- Migration 13: course reviews as comments (a review + replies under it, replies under replies...)
--
-- ONE table "reviews":
--   parent_id = null  → a REVIEW: stars 1..5 + optional text. Enrolled students only, one per course.
--   parent_id = <id>  → a REPLY to that review / reply: text only, no stars. Anyone logged in.
--   The tree has no depth limit (the UI stops indenting at level 3).
--
-- 1) the reviews table + rules (checks, one review per student)
-- 2) RLS: everybody reads, the rules above for writing, edit only your own
-- 3) triggers: real rating_avg / rating_count on the course + updated_at
-- 4) trigger: notifications (new review / new comment → the teacher, a reply → the comment's author)
-- 5) delete_review(): a comment with replies is "soft deleted" (stays as "This comment was deleted")
-- 6) get_course_reviews(): summary + stars + your review + a page of reviews with their replies (nested)
-- 7) courses "Updated <date>" doesn't move when only the numbers change + remove the fake seed numbers
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1) the table
-- ---------------------------------------------------------------------
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  parent_id  uuid references public.reviews (id) on delete cascade,  -- null = a review, else = a reply
  rating     smallint,                                               -- reviews only
  body       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,                                            -- "This comment was deleted"

  -- a review has 1..5 stars, a reply has no stars
  -- ("rating is not null" is needed: a check with null inside it passes!)
  constraint reviews_rating_check check (
    (parent_id is null and rating is not null and rating between 1 and 5)
    or (parent_id is not null and rating is null)
  ),
  -- no empty text ("" or spaces): null or real text, max 2000 letters
  constraint reviews_body_check check (body is null or (btrim(body) <> '' and char_length(body) <= 2000)),
  -- a reply needs text (a deleted one has none)
  constraint reviews_reply_body_check check (parent_id is null or deleted_at is not null or body is not null)
);

-- one review per student per course (a deleted review doesn't count → he can write a new one)
create unique index if not exists reviews_one_per_student
  on public.reviews (course_id, user_id)
  where parent_id is null and deleted_at is null;

create index if not exists reviews_course_top_level on public.reviews (course_id, created_at) where parent_id is null;
create index if not exists reviews_parent on public.reviews (parent_id);


-- ---------------------------------------------------------------------
-- 2) RLS
-- ---------------------------------------------------------------------
alter table public.reviews enable row level security;

revoke all on public.reviews from public, anon, authenticated;
grant select on public.reviews to anon, authenticated;
grant insert (course_id, parent_id, rating, body) on public.reviews to authenticated;  -- user_id = auth.uid() (default)
grant update (rating, body) on public.reviews to authenticated;                        -- edit the text / stars only
-- no delete grant: deleting goes through delete_review() (it decides: soft or real delete)

drop policy if exists "reviews are public" on public.reviews;
create policy "reviews are public" on public.reviews
  for select
  using (true);

drop policy if exists "students review, logged in users reply" on public.reviews;
create policy "students review, logged in users reply" on public.reviews
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      -- a review: enrolled in the course, and not its teacher
      (
        parent_id is null
        and public.is_enrolled_in(course_id)
        and not exists (
          select 1 from public.courses c
          where c.id = reviews.course_id and c.instructor_id = (select auth.uid())
        )
      )
      or
      -- a reply: to a comment of the SAME course that is not deleted, on a course he can see
      (
        parent_id is not null
        and exists (
          select 1 from public.reviews p
          where p.id = reviews.parent_id and p.course_id = reviews.course_id and p.deleted_at is null
        )
        and exists (select 1 from public.courses c where c.id = reviews.course_id)  -- courses RLS decides
      )
    )
  );

drop policy if exists "users edit their own comments" on public.reviews;
create policy "users edit their own comments" on public.reviews
  for update to authenticated
  using (user_id = (select auth.uid()) and deleted_at is null)
  with check (user_id = (select auth.uid()));


-- ---------------------------------------------------------------------
-- 3) triggers: updated_at + the real rating numbers of the course
-- ---------------------------------------------------------------------
drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- rating_avg / rating_count = the live reviews (not replies, not deleted)
create or replace function public.refresh_course_rating(p_course_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.courses c
  set rating_avg   = coalesce(stats.average, 0),
      rating_count = stats.total
  from (
    select round(avg(r.rating), 1) as average,
           count(*)                as total
    from public.reviews r
    where r.course_id = p_course_id and r.parent_id is null and r.deleted_at is null
  ) stats
  where c.id = p_course_id;
$$;

create or replace function public.reviews_refresh_course_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.parent_id is null then
      perform public.refresh_course_rating(old.course_id);
    end if;
    return null;
  end if;

  if new.parent_id is null then
    perform public.refresh_course_rating(new.course_id);
  end if;
  return null;
end;
$$;

drop trigger if exists reviews_refresh_course_rating on public.reviews;
create trigger reviews_refresh_course_rating
  after insert or delete or update of rating, deleted_at on public.reviews
  for each row execute function public.reviews_refresh_course_rating();


-- ---------------------------------------------------------------------
-- 4) notifications
--    a review           → the teacher ("Sara rated React 5 stars")
--    a reply            → the author of the comment ("Omar replied to your comment on React")
--                       + the teacher ("Omar commented on React")
--    nobody gets a notification for his own action, and the teacher gets ONE (not two)
-- ---------------------------------------------------------------------
alter table public.notifications drop constraint if exists notifications_type_check;
alter table public.notifications add constraint notifications_type_check check (
  type = any (array[
    'new_enrollment', 'application_approved', 'application_rejected', 'new_lesson',
    'course_published', 'new_review', 'announcement', 'new_comment', 'comment_reply'
  ])
);

create or replace function public.reviews_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor_name    text;
  v_course_title  text;
  v_link          text;
  v_teacher_id    uuid;
  v_parent_author uuid;
begin
  select btrim(coalesce(p.first_name, '') || ' ' || coalesce(p.last_name, '')) into v_actor_name
  from public.profiles p where p.id = new.user_id;
  v_actor_name := coalesce(nullif(v_actor_name, ''), 'Someone');

  select c.title, c.instructor_id, '/courses/' || c.slug || '#reviews'
  into v_course_title, v_teacher_id, v_link
  from public.courses c where c.id = new.course_id;

  -- a review → the teacher
  if new.parent_id is null then
    insert into public.notifications (user_id, actor_id, type, title, link)
    values (
      v_teacher_id, new.user_id, 'new_review',
      left(v_actor_name || ' rated ' || v_course_title || ' ' || new.rating || (case when new.rating = 1 then ' star' else ' stars' end), 200),
      v_link
    );
    return null;
  end if;

  -- a reply → the author of the comment it answers
  select r.user_id into v_parent_author from public.reviews r where r.id = new.parent_id;

  if v_parent_author <> new.user_id then
    insert into public.notifications (user_id, actor_id, type, title, link)
    values (
      v_parent_author, new.user_id, 'comment_reply',
      left(v_actor_name || ' replied to your comment on ' || v_course_title, 200),
      v_link
    );
  end if;

  -- a reply → the teacher (not his own reply, and not twice when he wrote the comment)
  if v_teacher_id <> new.user_id and v_teacher_id <> v_parent_author then
    insert into public.notifications (user_id, actor_id, type, title, link)
    values (
      v_teacher_id, new.user_id, 'new_comment',
      left(v_actor_name || ' commented on ' || v_course_title, 200),
      v_link
    );
  end if;

  return null;
end;
$$;

drop trigger if exists reviews_notify on public.reviews;
create trigger reviews_notify
  after insert on public.reviews
  for each row execute function public.reviews_notify();


-- ---------------------------------------------------------------------
-- 5) delete_review: delete YOUR comment
--    no replies under it → really deleted
--    replies under it    → "soft deleted": the text goes, the row stays → the replies stay under it
--    + a soft deleted parent left with no replies is really deleted too (going up)
-- ---------------------------------------------------------------------
create or replace function public.delete_review(p_review_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_parent_id uuid;
begin
  select r.parent_id into v_parent_id
  from public.reviews r
  where r.id = p_review_id and r.user_id = (select auth.uid()) and r.deleted_at is null;

  if not found then
    raise exception 'Comment not found' using errcode = 'P0002';
  end if;

  if exists (select 1 from public.reviews c where c.parent_id = p_review_id) then
    update public.reviews set deleted_at = now(), body = null where id = p_review_id;
    return;
  end if;

  delete from public.reviews where id = p_review_id;

  -- clean the empty "This comment was deleted" parents above it
  while v_parent_id is not null loop
    exit when not exists (select 1 from public.reviews p where p.id = v_parent_id and p.deleted_at is not null)
           or exists (select 1 from public.reviews c where c.parent_id = v_parent_id);

    delete from public.reviews where id = v_parent_id
    returning parent_id into v_parent_id;
  end loop;
end;
$$;


-- ---------------------------------------------------------------------
-- 6) get_course_reviews
--    {
--      summary:  { average, count, stars: [{ stars: 5, count }, ... { stars: 1, count }] },
--      canReview: enrolled and not the teacher,
--      myReview: { id, rating, body } | null,
--      reviews:  [ node ], hasMore,
--    }
--    node = { id, rating, body, isDeleted, isEdited, isMine, isInstructor, createdAt,
--             author: { id, firstName, lastName, avatarUrl } | null, repliesCount, replies: [ node ] }
--    security definer: the students' profiles are private → only name + avatar go out
-- ---------------------------------------------------------------------

-- one comment + every reply under it (calls itself for each reply)
create or replace function public.review_node(p_review_id uuid, p_teacher_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  return (
    select jsonb_build_object(
      'id', r.id,
      'rating', r.rating,
      'body', r.body,
      'isDeleted', r.deleted_at is not null,
      'isEdited', r.deleted_at is null and r.updated_at > r.created_at + interval '1 second',
      'isMine', r.user_id = (select auth.uid()),
      'isInstructor', r.user_id = p_teacher_id,
      'createdAt', r.created_at,
      'author', case when r.deleted_at is null then jsonb_build_object(
        'id', p.id, 'firstName', p.first_name, 'lastName', p.last_name, 'avatarUrl', p.avatar_url
      ) end,
      'replies', coalesce((
        select jsonb_agg(public.review_node(c.id, p_teacher_id) order by c.created_at)
        from public.reviews c
        where c.parent_id = r.id
      ), '[]'::jsonb)
    )
    from public.reviews r
    join public.profiles p on p.id = r.user_id
    where r.id = p_review_id
  );
end;
$$;

-- how many replies under a comment (all levels) → "View 3 replies"
create or replace function public.review_replies_count(p_review_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  with recursive tree as (
    select id from public.reviews where parent_id = p_review_id
    union all
    select r.id from public.reviews r join tree t on r.parent_id = t.id
  )
  select count(*)::integer from tree;
$$;

create or replace function public.get_course_reviews(
  p_course_id uuid,
  p_sort      text    default 'newest',
  p_limit     integer default 10,
  p_offset    integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_teacher_id uuid;
  v_user_id    uuid := (select auth.uid());
  v_limit      integer := least(greatest(coalesce(p_limit, 10), 1), 50);
  v_offset     integer := greatest(coalesce(p_offset, 0), 0);
  v_reviews    jsonb;
  v_total      integer;
begin
  -- the same rule as the courses read policy: published / his own / bought
  select c.instructor_id into v_teacher_id
  from public.courses c
  where c.id = p_course_id
    and (c.status = 'published' or c.instructor_id = v_user_id or public.is_enrolled_in(c.id));

  if not found then
    return null;
  end if;

  -- the top level comments (a deleted one still shows when it has replies)
  select count(*) into v_total
  from public.reviews r
  where r.course_id = p_course_id and r.parent_id is null;

  select coalesce(jsonb_agg(
           public.review_node(page.id, v_teacher_id)
             || jsonb_build_object('repliesCount', public.review_replies_count(page.id))
           order by page.row_number
         ), '[]'::jsonb)
  into v_reviews
  from (
    select r.id,
           row_number() over (
             order by case when p_sort = 'oldest' then r.created_at end asc,
                      r.created_at desc
           ) as row_number
    from public.reviews r
    where r.course_id = p_course_id and r.parent_id is null
    order by row_number
    limit v_limit offset v_offset
  ) page;

  return jsonb_build_object(
    'summary', (
      select jsonb_build_object(
        'average', coalesce(round(avg(r.rating), 1), 0),
        'count', count(r.id),
        'stars', (
          select jsonb_agg(jsonb_build_object(
                   'stars', s.stars,
                   'count', (select count(*) from public.reviews x
                             where x.course_id = p_course_id and x.parent_id is null
                               and x.deleted_at is null and x.rating = s.stars)
                 ) order by s.stars desc)
          from generate_series(1, 5) as s (stars)
        )
      )
      from public.reviews r
      where r.course_id = p_course_id and r.parent_id is null and r.deleted_at is null
    ),
    'canReview', v_user_id is not null and v_user_id <> v_teacher_id and public.is_enrolled_in(p_course_id),
    'myReview', (
      select jsonb_build_object('id', r.id, 'rating', r.rating, 'body', r.body)
      from public.reviews r
      where r.course_id = p_course_id and r.parent_id is null and r.deleted_at is null
        and r.user_id = v_user_id
    ),
    'reviews', v_reviews,
    'hasMore', v_offset + v_limit < v_total
  );
end;
$$;

revoke all on function public.refresh_course_rating(uuid)          from public, anon, authenticated;
revoke all on function public.reviews_refresh_course_rating()      from public, anon, authenticated;
revoke all on function public.reviews_notify()                     from public, anon, authenticated;
revoke all on function public.review_node(uuid, uuid)              from public, anon, authenticated;
revoke all on function public.review_replies_count(uuid)           from public, anon, authenticated;
revoke all on function public.delete_review(uuid)                  from public, anon;
revoke all on function public.get_course_reviews(uuid, text, integer, integer) from public;
grant execute on function public.delete_review(uuid) to authenticated;
grant execute on function public.get_course_reviews(uuid, text, integer, integer) to anon, authenticated;


-- ---------------------------------------------------------------------
-- 7) "Updated <month year>" on the course page = the CONTENT changed
--    before: every new student / review moved updated_at (the numbers are columns of courses too)
--    now: a change of ONLY the numbers doesn't touch updated_at
-- ---------------------------------------------------------------------
drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row
  when (
    (to_jsonb(old) - array['rating_avg', 'rating_count', 'students_count', 'updated_at'])
    is distinct from
    (to_jsonb(new) - array['rating_avg', 'rating_count', 'students_count', 'updated_at'])
  )
  execute function public.set_updated_at();

-- remove the fake seed numbers: every course = its real reviews (none yet → 0)
update public.courses c
set rating_avg   = coalesce(stats.average, 0),
    rating_count = coalesce(stats.total, 0)
from public.courses c2
left join (
  select r.course_id, round(avg(r.rating), 1) as average, count(*) as total
  from public.reviews r
  where r.parent_id is null and r.deleted_at is null
  group by r.course_id
) stats on stats.course_id = c2.id
where c.id = c2.id;
