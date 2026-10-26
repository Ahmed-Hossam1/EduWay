-- =====================================================================
-- Migration 14: review_node() returns the row names of the tables (created_at, first_name...)
-- → the frontend types are Pick<Profile, ...> / Pick<Review, ...> (one source per entity)
-- =====================================================================

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
      'created_at', r.created_at,
      'author', case when r.deleted_at is null then jsonb_build_object(
        'id', p.id, 'first_name', p.first_name, 'last_name', p.last_name, 'avatar_url', p.avatar_url
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
