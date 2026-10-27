-- Coursue admin foundation: roles, admin authorization, audit log, settings, and RLS.
-- Run this migration as the database owner (Supabase SQL Editor is sufficient).

alter table public.profiles
  add column if not exists role text not null default 'student';

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('student', 'mentor', 'admin'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Database-owner and service-role operations have no end-user uid and remain possible.
  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'INSERT' and coalesce(new.role, 'student') <> 'student' and not public.is_admin() then
    raise exception 'Only an admin can assign a privileged profile role'
      using errcode = '42501';
  end if;

  if tg_op = 'UPDATE' and new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an admin can change a profile role'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_profile_role_trigger on public.profiles;
create trigger guard_profile_role_trigger
before insert or update on public.profiles
for each row execute function public.guard_profile_role();

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_actor_id_idx on public.audit_logs(actor_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);

create table if not exists public.platform_settings (
  id boolean primary key default true check (id),
  platform_name text not null default 'Coursue',
  support_email text not null default 'support@coursue.test',
  allow_registration boolean not null default true,
  maintenance_mode boolean not null default false,
  max_upload_size_mb integer not null default 10 check (max_upload_size_mb between 1 and 100),
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (id)
values (true)
on conflict (id) do nothing;

alter table public.audit_logs enable row level security;
alter table public.platform_settings enable row level security;
alter table public.profiles enable row level security;

revoke all on public.audit_logs from anon, authenticated;
grant select, insert on public.audit_logs to authenticated;
revoke all on public.platform_settings from anon, authenticated;
grant select, insert, update, delete on public.platform_settings to authenticated;

drop policy if exists "Admins can read audit logs" on public.audit_logs;
create policy "Admins can read audit logs"
on public.audit_logs for select to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert audit logs" on public.audit_logs;
create policy "Admins can insert audit logs"
on public.audit_logs for insert to authenticated
with check (public.is_admin() and (actor_id = auth.uid() or actor_id is null));

-- Intentionally no UPDATE or DELETE policy for audit_logs.

drop policy if exists "Authenticated users can read platform settings" on public.platform_settings;
create policy "Authenticated users can read platform settings"
on public.platform_settings for select to authenticated
using (true);

drop policy if exists "Admins can insert platform settings" on public.platform_settings;
create policy "Admins can insert platform settings"
on public.platform_settings for insert to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update platform settings" on public.platform_settings;
create policy "Admins can update platform settings"
on public.platform_settings for update to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete platform settings" on public.platform_settings;
create policy "Admins can delete platform settings"
on public.platform_settings for delete to authenticated
using (public.is_admin());

drop policy if exists "Admins can read every profile" on public.profiles;
create policy "Admins can read every profile"
on public.profiles for select to authenticated
using (public.is_admin());

drop policy if exists "Admins can update every profile" on public.profiles;
create policy "Admins can update every profile"
on public.profiles for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Apply explicit admin CRUD policies only to catalog/moderation tables that already exist.
-- Personal tasks and private messages are deliberately excluded.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'courses', 'course_sections', 'lessons', 'categories', 'enrollments',
    'reviews', 'groups', 'group_members', 'group_posts', 'group_comments'
  ]
  loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('drop policy if exists "Admin select all" on public.%I', table_name);
      execute format('create policy "Admin select all" on public.%I for select to authenticated using (public.is_admin())', table_name);
      execute format('drop policy if exists "Admin insert all" on public.%I', table_name);
      execute format('create policy "Admin insert all" on public.%I for insert to authenticated with check (public.is_admin())', table_name);
      execute format('drop policy if exists "Admin update all" on public.%I', table_name);
      execute format('create policy "Admin update all" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', table_name);
      execute format('drop policy if exists "Admin delete all" on public.%I', table_name);
      execute format('create policy "Admin delete all" on public.%I for delete to authenticated using (public.is_admin())', table_name);
    end if;
  end loop;
end $$;

comment on function public.is_admin() is 'Returns true only when auth.uid() belongs to a profile with role admin.';
comment on table public.audit_logs is 'Immutable admin-visible record of important platform actions.';
comment on table public.platform_settings is 'Singleton platform-wide configuration row.';
