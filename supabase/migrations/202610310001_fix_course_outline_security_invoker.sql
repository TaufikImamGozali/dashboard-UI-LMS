-- Migration: 202610310001_fix_course_outline_security_invoker.sql
-- Description: Fix Supabase Security Advisor Critical alert on public.course_outline view.
-- Changes view to security_invoker = true and aligns lessons table RLS policy.

-- 1. Update RLS policy on public.lessons so querying users (both authenticated and anon)
--    can read published lessons metadata while respecting RLS.
drop policy if exists "Select lessons if enrolled, preview, or admin" on public.lessons;
drop policy if exists "Anyone can select lessons from published courses" on public.lessons;

create policy "Anyone can select lessons from published courses"
  on public.lessons for select
  to authenticated, anon
  using (
    public.is_admin()
    or exists (
      select 1 from public.courses c
      where c.id = lessons.course_id
        and c.status = 'published'
    )
  );

-- 2. Redefine public.course_outline with security_invoker = true
--    This resolves Supabase Security Advisor's "Security Definer View" warning.
create or replace view public.course_outline
with (security_invoker = true)
as
select
  l.id,
  l.course_id,
  l.title,
  l.description,
  l.position,
  l.duration_seconds,
  l.is_preview
from public.lessons l
join public.courses c on c.id = l.course_id
where c.status = 'published'
order by l.course_id, l.position asc;

grant select on public.course_outline to authenticated, anon;

