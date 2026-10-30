-- ==============================================================================
-- COURSUE LMS: ANNOUNCEMENTS TABLE & AVATARS STORAGE SETUP
-- Migration: 202610300002_announcements.sql
-- Description: Creates announcements table with strict RLS for LMS students and admins,
--              configures storage bucket for user profile avatars with size/type restrictions.
-- ==============================================================================

-- 1. ANNOUNCEMENTS TABLE
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  body text not null check (char_length(trim(body)) > 0),
  course_id uuid references public.courses(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. INDEXES
create index if not exists announcements_course_id_idx on public.announcements(course_id);
create index if not exists announcements_author_id_idx on public.announcements(author_id);
create index if not exists announcements_is_published_idx on public.announcements(is_published);
create index if not exists announcements_created_at_idx on public.announcements(created_at desc);

-- 3. UPDATED_AT TRIGGER
drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.announcements enable row level security;

-- 4.1 SELECT: Authenticated students can view published announcements if general (course_id is null)
--     OR if student is actively enrolled in that specific course.
drop policy if exists "Students can view general or enrolled course announcements" on public.announcements;
create policy "Students can view general or enrolled course announcements"
  on public.announcements for select
  to authenticated
  using (
    is_published = true
    and (
      course_id is null
      or exists (
        select 1 from public.enrollments e
        where e.course_id = announcements.course_id
          and e.user_id = auth.uid()
          and e.status = 'active'
      )
    )
  );

-- 4.2 FULL ACCESS: Platform Administrators can select, insert, update, delete all announcements
drop policy if exists "Admins have full access to announcements" on public.announcements;
create policy "Admins have full access to announcements"
  on public.announcements for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5. STORAGE BUCKET: AVATARS
-- Creates public bucket 'avatars' with 2MB limit and allowed image MIME types
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 5.1 Public read access for profile avatars
drop policy if exists "Public Access for Avatars" on storage.objects;
create policy "Public Access for Avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- 5.2 Authenticated users can upload their own avatar into folder `{user_id}/*`
drop policy if exists "Users can upload own avatar image" on storage.objects;
create policy "Users can upload own avatar image"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5.3 Authenticated users can update their own avatar image
drop policy if exists "Users can update own avatar image" on storage.objects;
create policy "Users can update own avatar image"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 5.4 Authenticated users can delete their own avatar image
drop policy if exists "Users can delete own avatar image" on storage.objects;
create policy "Users can delete own avatar image"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

