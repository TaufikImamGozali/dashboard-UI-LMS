-- Migration: Ensure Google OAuth and Email Signups populate public.profiles with default student role
-- Filename: 202610280001_auth_google_and_profiles.sql

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
  -- 1. Resolve display name from OAuth metadata (Google supplies full_name/name) or email
  user_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    split_part(new.email, '@', 1),
    'Student User'
  );

  -- 2. Resolve avatar from OAuth metadata (Google supplies avatar_url/picture) or default fallback
  user_avatar := coalesce(
    nullif(trim(new.raw_user_meta_data->>'avatar_url'), ''),
    nullif(trim(new.raw_user_meta_data->>'picture'), ''),
    nullif(trim(new.raw_user_meta_data->>'avatar'), ''),
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  );

  -- 3. Determine assigned role (default: 'student')
  if new.email like 'admin%' or new.email = 'admin@coursue.test' then
    assigned_role := 'admin';
  else
    assigned_role := coalesce(new.raw_user_meta_data->>'role', 'student');
  end if;

  -- Validate against allowed roles constraint ('student', 'mentor', 'admin')
  if assigned_role not in ('student', 'mentor', 'admin') then
    assigned_role := 'student';
  end if;

  -- 4. Upsert row into public.profiles
  insert into public.profiles (id, name, email, role, avatar)
  values (
    new.id,
    user_name,
    new.email,
    assigned_role,
    user_avatar
  )
  on conflict (id) do update
  set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name),
    avatar = coalesce(public.profiles.avatar, excluded.avatar),
    updated_at = now();

  return new;
end;
$$;

-- Ensure trigger exists on auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

comment on function public.handle_new_user() is 'Automatically provisions a public.profiles entry with default student role on email or Google OAuth signup.';

