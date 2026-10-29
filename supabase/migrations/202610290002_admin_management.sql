-- ==============================================================================
-- COURSUE LMS: ADMIN MANAGEMENT & SECURITY FOUNDATION
-- Migration: 202610290002_admin_management.sql
-- Description:
--   1. Add is_active column to public.profiles.
--   2. Strengthen guard_profile_security trigger:
--      - Prevents non-admins from changing role or is_active.
--      - Prevents admins from demoting or deactivating their own account.
--   3. Enable anon read on platform_settings for public maintenance mode check.
--   4. Foreign key link from audit_logs to profiles for easy actor joins.
--   5. Deferrable unique position constraint on lessons.
--   6. Atomic reorder_lessons RPC function for administrator curriculum ordering.
-- ==============================================================================

-- 1. ADD IS_ACTIVE TO PROFILES
alter table public.profiles
  add column if not exists is_active boolean not null default true;

create index if not exists profiles_is_active_idx on public.profiles(is_active);

-- 2. SECURE PROFILE ROLE AND STATUS WITH TRIGGER GUARD
create or replace function public.guard_profile_security()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Database owner, background jobs, or service-role actions have no auth.uid() and remain allowed
  if auth.uid() is null then
    return new;
  end if;

  -- 2.1 On INSERT:
  if tg_op = 'INSERT' then
    if coalesce(new.role, 'student') <> 'student' and not public.is_admin() then
      raise exception 'Only an admin can assign a privileged profile role'
        using errcode = '42501';
    end if;

    if new.is_active is false and not public.is_admin() then
      raise exception 'Only an admin can set account status to inactive'
        using errcode = '42501';
    end if;
  end if;

  -- 2.2 On UPDATE:
  if tg_op = 'UPDATE' then
    -- Admin self-protection: An administrator cannot demote or suspend themselves
    if auth.uid() = old.id and public.is_admin() then
      if new.role <> 'admin' then
        raise exception 'Admin cannot demote their own account'
          using errcode = '42501';
      end if;
      if new.is_active is false then
        raise exception 'Admin cannot deactivate their own account'
          using errcode = '42501';
      end if;
    end if;

    -- Non-admin cannot alter role
    if new.role is distinct from old.role and not public.is_admin() then
      raise exception 'Only an admin can change a profile role'
        using errcode = '42501';
    end if;

    -- Non-admin cannot alter is_active
    if new.is_active is distinct from old.is_active and not public.is_admin() then
      raise exception 'Only an admin can change user active status'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

-- Replace existing role trigger with complete security trigger
drop trigger if exists guard_profile_role_trigger on public.profiles;
drop trigger if exists guard_profile_security_trigger on public.profiles;

create trigger guard_profile_security_trigger
before insert or update on public.profiles
for each row execute function public.guard_profile_security();

-- 3. PERMISSIONS AND POLICIES ON PLATFORM SETTINGS
-- Allow both authenticated and anon users to read platform settings (needed for maintenance mode check)
grant select on public.platform_settings to anon, authenticated;

drop policy if exists "Authenticated users can read platform settings" on public.platform_settings;
drop policy if exists "Anyone can read platform settings" on public.platform_settings;

create policy "Anyone can read platform settings"
  on public.platform_settings for select
  to anon, authenticated
  using (true);

-- 4. LINK AUDIT_LOGS ACTOR TO PROFILES FOR AUTOMATIC POSTGREST EMBEDDING
-- Drop old foreign key to auth.users if exists and link to public.profiles
alter table public.audit_logs
  drop constraint if exists audit_logs_actor_id_fkey;

alter table public.audit_logs
  add constraint audit_logs_actor_id_fkey
  foreign key (actor_id) references public.profiles(id)
  on delete set null;

-- Ensure authenticated admins can read audit logs with joined profiles
grant select, insert on public.audit_logs to authenticated;

-- 5. DEFERRABLE UNIQUE CONSTRAINT ON LESSONS
-- Allows temporary position overlap within transactions or multi-row updates
alter table public.lessons
  drop constraint if exists lessons_course_position_unique;

alter table public.lessons
  add constraint lessons_course_position_unique
  unique (course_id, position) deferrable initially deferred;

-- 6. ATOMIC REORDER LESSONS RPC FUNCTION
create or replace function public.reorder_lessons(p_course_id uuid, p_lesson_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  i int;
  total_lessons int;
begin
  -- Only admin can reorder curriculum
  if not public.is_admin() then
    raise exception 'Only administrators can reorder lessons'
      using errcode = '42501';
  end if;

  total_lessons := array_length(p_lesson_ids, 1);
  if total_lessons is null or total_lessons = 0 then
    return;
  end if;

  -- Phase 1: Set temporary negative positions to eliminate any collision during reordering
  for i in 1 .. total_lessons loop
    update public.lessons
    set position = -i
    where id = p_lesson_ids[i]
      and course_id = p_course_id;
  end loop;

  -- Phase 2: Set final 1-based sequential positions
  for i in 1 .. total_lessons loop
    update public.lessons
    set position = i
    where id = p_lesson_ids[i]
      and course_id = p_course_id;
  end loop;
end;
$$;

revoke all on function public.reorder_lessons(uuid, uuid[]) from public;
grant execute on function public.reorder_lessons(uuid, uuid[]) to authenticated;

comment on function public.reorder_lessons(uuid, uuid[]) is 'Atomically reorders lessons for a course given an ordered list of lesson IDs.';
comment on column public.profiles.is_active is 'Whether this user account is active or suspended by an administrator.';

