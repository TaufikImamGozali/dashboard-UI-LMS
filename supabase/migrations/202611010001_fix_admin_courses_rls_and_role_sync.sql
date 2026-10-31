-- ==============================================================================
-- COURSUE LMS: FIX ADMIN COURSES RLS & ROLE SYNCHRONIZATION
-- Migration: 202611010001_fix_admin_courses_rls_and_role_sync.sql
-- Description:
--   0. Ensure profiles table has role and is_active columns with proper constraints.
--   1. Ensure courses category constraint covers all modern categories.
--   2. Strengthen public.is_admin() with multi-layer check (profiles table, JWT email, metadata).
--   3. Update courses & lessons RLS policies to allow administrators and course mentors.
--   4. Provide atomic self-healing RPC public.sync_current_user_admin_role().
--   5. Update handle_new_user() to promote admin roles on profile upsert.
--   6. Synchronize all existing admin user accounts in public.profiles.
-- ==============================================================================

-- 0. ENSURE PROFILES COLUMNS AND CONSTRAINTS EXIST
alter table public.profiles
  add column if not exists role text not null default 'student';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student', 'mentor', 'admin'));

alter table public.profiles
  add column if not exists is_active boolean not null default true;

create index if not exists profiles_is_active_idx on public.profiles(is_active);

-- 1. ENSURE COURSES CATEGORY CONSTRAINT IS EXPANDED
alter table public.courses drop constraint if exists courses_category_check;
alter table public.courses add constraint courses_category_check
  check (category in (
    'frontend', 'design', 'branding', 'mobile', 'devops', 'general',
    'ai', 'marketing', 'data', 'security', 'creative', 'softskills', 'finance', 'business'
  ));

-- 2. STRENGTHEN public.is_admin() FUNCTION
-- Evaluates true if:
--   a) Profile role in public.profiles is 'admin'
--   b) Auth JWT email pattern matches admin (e.g. admin@..., *admin*@..., or official admin emails)
--   c) Auth JWT user_metadata or app_metadata indicates admin or service_role
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select (
    -- 2.1 Check if profile role is explicitly 'admin'
    exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role = 'admin'
    )
    or
    -- 2.2 Check if auth JWT email is an admin email
    (
      auth.jwt() ->> 'email' is not null
      and (
        auth.jwt() ->> 'email' ilike 'admin@%'
        or auth.jwt() ->> 'email' ilike '%admin%'
        or auth.jwt() ->> 'email' in ('admin@coursue.com', 'admin@coursue.test')
      )
    )
    or
    -- 2.3 Check if user or app metadata marks them as admin
    (
      coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin'
      or coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'service_role')
    )
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- 3. UPDATE COURSES RLS POLICIES
-- Allow SELECT for published courses (or all for admin/mentor)
drop policy if exists "Admins can select all courses" on public.courses;
create policy "Admins can select all courses"
  on public.courses for select
  to authenticated
  using (
    public.is_admin()
    or mentor_id = auth.uid()
  );

-- Allow INSERT for admins or assigned mentors
drop policy if exists "Admins can insert courses" on public.courses;
create policy "Admins can insert courses"
  on public.courses for insert
  to authenticated
  with check (
    public.is_admin()
    or (
      mentor_id = auth.uid()
      and exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'mentor')
      )
    )
  );

-- Allow UPDATE for admins or course mentors
drop policy if exists "Admins can update courses" on public.courses;
create policy "Admins can update courses"
  on public.courses for update
  to authenticated
  using (
    public.is_admin()
    or (
      mentor_id = auth.uid()
      and exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'mentor')
      )
    )
  )
  with check (
    public.is_admin()
    or (
      mentor_id = auth.uid()
      and exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'mentor')
      )
    )
  );

-- Allow DELETE for admins or course mentors
drop policy if exists "Admins can delete courses" on public.courses;
create policy "Admins can delete courses"
  on public.courses for delete
  to authenticated
  using (
    public.is_admin()
    or (
      mentor_id = auth.uid()
      and exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'mentor')
      )
    )
  );

-- 4. UPDATE LESSONS RLS POLICIES
-- Allow INSERT for admins or mentors of the parent course
drop policy if exists "Admins can insert lessons" on public.lessons;
create policy "Admins can insert lessons"
  on public.lessons for insert
  to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1 from public.courses c
      where c.id = lessons.course_id
        and c.mentor_id = auth.uid()
    )
  );

-- Allow UPDATE for admins or mentors of the parent course
drop policy if exists "Admins can update lessons" on public.lessons;
create policy "Admins can update lessons"
  on public.lessons for update
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.courses c
      where c.id = lessons.course_id
        and c.mentor_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.courses c
      where c.id = lessons.course_id
        and c.mentor_id = auth.uid()
    )
  );

-- Allow DELETE for admins or mentors of the parent course
drop policy if exists "Admins can delete lessons" on public.lessons;
create policy "Admins can delete lessons"
  on public.lessons for delete
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.courses c
      where c.id = lessons.course_id
        and c.mentor_id = auth.uid()
    )
  );

-- 5. ATOMIC SELF-HEALING RPC TO SYNC ADMIN PROFILE
-- Can be called by client upon entering admin dashboard or before mutating courses
create or replace function public.sync_current_user_admin_role()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  user_email text;
  is_admin_user boolean;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    return jsonb_build_object('success', false, 'error', 'Unauthenticated');
  end if;

  user_email := auth.jwt() ->> 'email';
  is_admin_user := public.is_admin();

  if is_admin_user then
    insert into public.profiles (id, email, name, role, is_active)
    values (
      current_user_id,
      coalesce(user_email, 'admin@coursue.com'),
      coalesce(auth.jwt() -> 'user_metadata' ->> 'name', auth.jwt() -> 'user_metadata' ->> 'full_name', 'Administrator'),
      'admin',
      true
    )
    on conflict (id) do update
    set
      role = 'admin',
      is_active = true,
      updated_at = now();

    return jsonb_build_object('success', true, 'role', 'admin');
  end if;

  return jsonb_build_object('success', true, 'role', 'student');
end;
$$;

revoke all on function public.sync_current_user_admin_role() from public;
grant execute on function public.sync_current_user_admin_role() to authenticated;

-- 6. UPDATE handle_new_user() TRIGGER TO PROMOTE ADMIN ROLES
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_name text;
  assigned_role text;
  user_avatar text;
begin
  -- 1. Resolve display name
  user_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    split_part(new.email, '@', 1),
    'Student User'
  );

  -- 2. Resolve avatar
  user_avatar := coalesce(
    nullif(trim(new.raw_user_meta_data->>'avatar_url'), ''),
    nullif(trim(new.raw_user_meta_data->>'picture'), ''),
    nullif(trim(new.raw_user_meta_data->>'avatar'), ''),
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  );

  -- 3. Determine assigned role
  if new.email ilike 'admin@%' or new.email ilike '%admin%' or new.email in ('admin@coursue.com', 'admin@coursue.test') then
    assigned_role := 'admin';
  else
    assigned_role := coalesce(new.raw_user_meta_data->>'role', 'student');
  end if;

  if assigned_role not in ('student', 'mentor', 'admin') then
    assigned_role := 'student';
  end if;

  -- 4. Upsert row into public.profiles
  insert into public.profiles (id, name, email, role, avatar, is_active)
  values (
    new.id,
    user_name,
    new.email,
    assigned_role,
    user_avatar,
    true
  )
  on conflict (id) do update
  set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name),
    avatar = coalesce(public.profiles.avatar, excluded.avatar),
    role = case
      when excluded.role = 'admin' then 'admin'
      else public.profiles.role
    end,
    is_active = coalesce(public.profiles.is_active, true),
    updated_at = now();

  return new;
end;
$$;

-- 7. ONE-TIME SYNCHRONIZATION FOR ALL EXISTING ADMIN ACCOUNTS
update public.profiles
set
  role = 'admin',
  is_active = true,
  updated_at = now()
where
  email ilike 'admin@%'
  or email ilike '%admin%'
  or email in ('admin@coursue.com', 'admin@coursue.test');

comment on function public.is_admin() is 'Returns true if authenticated user has admin role in profiles or admin JWT claims.';
