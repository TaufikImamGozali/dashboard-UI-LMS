-- ==============================================================================
-- COURSUE LMS: CORE DATABASE FOUNDATION (COURSES, LESSONS, ENROLLMENTS, PROGRESS)
-- Migration: 202610290001_lms_core.sql
-- Description: Core tables, updated_at trigger, indexes, course_outline view,
--              progress view/functions, and strict Row Level Security (RLS) policies.
-- ==============================================================================

-- 0. Generic updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. COURSES TABLE
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  thumbnail_url text,
  category text not null check (category in ('frontend', 'design', 'branding', 'mobile', 'devops', 'general')),
  level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  price numeric(10, 2) not null default 0 check (price >= 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  mentor_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. LESSONS TABLE
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  youtube_url text,
  youtube_video_id text,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  position integer not null check (position >= 1),
  is_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_course_position_unique unique (course_id, position)
);

-- 3. ENROLLMENTS TABLE
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'revoked')),
  source text not null default 'free' check (source in ('free', 'purchase', 'admin')),
  enrolled_at timestamptz not null default now(),
  constraint enrollments_user_course_unique unique (user_id, course_id)
);

-- 4. LESSON PROGRESS TABLE
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  last_position_seconds integer not null default 0 check (last_position_seconds >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint lesson_progress_user_lesson_unique unique (user_id, lesson_id)
);

-- 5. INDEXES FOR QUERY OPTIMIZATION
create index if not exists courses_status_idx on public.courses(status);
create index if not exists courses_category_idx on public.courses(category);
create index if not exists courses_mentor_id_idx on public.courses(mentor_id);
create index if not exists courses_created_at_idx on public.courses(created_at desc);

create index if not exists lessons_course_id_idx on public.lessons(course_id);
create index if not exists lessons_course_pos_idx on public.lessons(course_id, position);

create index if not exists enrollments_user_id_idx on public.enrollments(user_id);
create index if not exists enrollments_course_id_idx on public.enrollments(course_id);
create index if not exists enrollments_status_idx on public.enrollments(status);

create index if not exists lesson_progress_user_id_idx on public.lesson_progress(user_id);
create index if not exists lesson_progress_lesson_id_idx on public.lesson_progress(lesson_id);
create index if not exists lesson_progress_completed_idx on public.lesson_progress(completed);

-- 6. UPDATED_AT TRIGGERS
drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

drop trigger if exists set_lessons_updated_at on public.lessons;
create trigger set_lessons_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

drop trigger if exists set_lesson_progress_updated_at on public.lesson_progress;
create trigger set_lesson_progress_updated_at
  before update on public.lesson_progress
  for each row execute function public.set_updated_at();

-- 7. PUBLIC COURSE OUTLINE VIEW
-- Excludes youtube_url and youtube_video_id so visitors can explore curriculum safely
create or replace view public.course_outline
with (security_invoker = false)
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

-- 8. USER COURSE PROGRESS VIEW
create or replace view public.user_course_progress
with (security_invoker = true)
as
select
  e.user_id,
  e.course_id,
  c.title as course_title,
  c.slug as course_slug,
  c.thumbnail_url as course_thumbnail,
  c.category as course_category,
  c.level as course_level,
  c.price as course_price,
  e.status as enrollment_status,
  e.enrolled_at,
  count(l.id)::int as total_lessons,
  count(lp.id) filter (where lp.completed = true)::int as completed_lessons,
  case
    when count(l.id) > 0 then
      round((count(lp.id) filter (where lp.completed = true)::numeric / count(l.id)::numeric) * 100, 1)
    else 0
  end as progress_percentage,
  case
    when count(l.id) = 0 then 'not-started'
    when count(lp.id) filter (where lp.completed = true) = 0 then 'not-started'
    when count(lp.id) filter (where lp.completed = true) = count(l.id) then 'completed'
    else 'in-progress'
  end as calculated_status,
  max(lp.updated_at) as last_activity_at
from public.enrollments e
join public.courses c on c.id = e.course_id
left join public.lessons l on l.course_id = c.id
left join public.lesson_progress lp
  on lp.lesson_id = l.id
 and lp.user_id = e.user_id
group by e.user_id, e.course_id, c.title, c.slug, c.thumbnail_url, c.category, c.level, c.price, e.status, e.enrolled_at;

grant select on public.user_course_progress to authenticated;

-- 9. USER COURSE PROGRESS HELPER FUNCTION
create or replace function public.get_user_course_progress(p_user_id uuid, p_course_id uuid)
returns table (
  total_lessons int,
  completed_lessons int,
  progress_percentage numeric,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(l.id)::int as total_lessons,
    count(lp.id) filter (where lp.completed = true)::int as completed_lessons,
    case
      when count(l.id) > 0 then
        round((count(lp.id) filter (where lp.completed = true)::numeric / count(l.id)::numeric) * 100, 1)
      else 0
    end as progress_percentage,
    case
      when count(l.id) = 0 then 'not-started'
      when count(lp.id) filter (where lp.completed = true) = 0 then 'not-started'
      when count(lp.id) filter (where lp.completed = true) = count(l.id) then 'completed'
      else 'in-progress'
    end as status
  from public.courses c
  left join public.lessons l on l.course_id = c.id
  left join public.lesson_progress lp
    on lp.lesson_id = l.id
   and lp.user_id = p_user_id
  where c.id = p_course_id
  group by c.id;
$$;

revoke all on function public.get_user_course_progress(uuid, uuid) from public;
grant execute on function public.get_user_course_progress(uuid, uuid) to authenticated;

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

-- 10.1 COURSES POLICIES
drop policy if exists "Anyone can select published courses" on public.courses;
create policy "Anyone can select published courses"
  on public.courses for select
  to authenticated, anon
  using (status = 'published');

drop policy if exists "Admins can select all courses" on public.courses;
create policy "Admins can select all courses"
  on public.courses for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert courses" on public.courses;
create policy "Admins can insert courses"
  on public.courses for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update courses" on public.courses;
create policy "Admins can update courses"
  on public.courses for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete courses" on public.courses;
create policy "Admins can delete courses"
  on public.courses for delete
  to authenticated
  using (public.is_admin());

-- 10.2 LESSONS POLICIES
-- SELECT allowed if: admin OR user actively enrolled OR lesson is preview of published course
drop policy if exists "Select lessons if enrolled, preview, or admin" on public.lessons;
create policy "Select lessons if enrolled, preview, or admin"
  on public.lessons for select
  to authenticated, anon
  using (
    public.is_admin()
    or (
      is_preview = true
      and exists (
        select 1 from public.courses c
        where c.id = lessons.course_id
          and c.status = 'published'
      )
    )
    or (
      auth.uid() is not null
      and exists (
        select 1 from public.enrollments e
        where e.course_id = lessons.course_id
          and e.user_id = auth.uid()
          and e.status = 'active'
      )
    )
  );

drop policy if exists "Admins can insert lessons" on public.lessons;
create policy "Admins can insert lessons"
  on public.lessons for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update lessons" on public.lessons;
create policy "Admins can update lessons"
  on public.lessons for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete lessons" on public.lessons;
create policy "Admins can delete lessons"
  on public.lessons for delete
  to authenticated
  using (public.is_admin());

-- 10.3 ENROLLMENTS POLICIES
drop policy if exists "Users can select own enrollments" on public.enrollments;
create policy "Users can select own enrollments"
  on public.enrollments for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Users can self-enroll ONLY in free published courses with status=active and source=free
drop policy if exists "Users can enroll themselves in free published courses" on public.enrollments;
create policy "Users can enroll themselves in free published courses"
  on public.enrollments for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and status = 'active'
    and source = 'free'
    and exists (
      select 1 from public.courses c
      where c.id = enrollments.course_id
        and c.status = 'published'
        and c.price = 0
    )
  );

drop policy if exists "Admins can insert enrollments" on public.enrollments;
create policy "Admins can insert enrollments"
  on public.enrollments for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update enrollments" on public.enrollments;
create policy "Admins can update enrollments"
  on public.enrollments for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete enrollments" on public.enrollments;
create policy "Admins can delete enrollments"
  on public.enrollments for delete
  to authenticated
  using (public.is_admin());

-- 10.4 LESSON PROGRESS POLICIES
drop policy if exists "Users can select own lesson progress" on public.lesson_progress;
create policy "Users can select own lesson progress"
  on public.lesson_progress for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can insert own lesson progress" on public.lesson_progress;
create policy "Users can insert own lesson progress"
  on public.lesson_progress for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.lessons l
      join public.enrollments e on e.course_id = l.course_id
      where l.id = lesson_progress.lesson_id
        and e.user_id = auth.uid()
        and e.status = 'active'
    )
  );

drop policy if exists "Users can update own lesson progress" on public.lesson_progress;
create policy "Users can update own lesson progress"
  on public.lesson_progress for update
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1
      from public.lessons l
      join public.enrollments e on e.course_id = l.course_id
      where l.id = lesson_progress.lesson_id
        and e.user_id = auth.uid()
        and e.status = 'active'
    )
  )
  with check (
    user_id = auth.uid()
  );

drop policy if exists "Admins can manage all lesson progress" on public.lesson_progress;
create policy "Admins can manage all lesson progress"
  on public.lesson_progress for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

