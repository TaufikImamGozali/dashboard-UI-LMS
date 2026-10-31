-- Migration: 202610310002_course_assignments.sql
-- Description: Creates course_assignments and assignment_submissions tables with RLS and initial seed data.

-- 1. COURSE ASSIGNMENTS TABLE
create table if not exists public.course_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade unique,
  title text not null,
  description text not null,
  requirements jsonb not null default '[]'::jsonb,
  due_days int not null default 14,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. ASSIGNMENT SUBMISSIONS TABLE
create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.course_assignments(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  project_url text not null,
  notes text,
  status text not null check (status in ('submitted', 'under_review', 'approved', 'rejected')) default 'submitted',
  grade numeric,
  feedback text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  constraint unique_student_assignment unique (assignment_id, user_id)
);

-- Indexes
create index if not exists idx_course_assignments_course_id on public.course_assignments(course_id);
create index if not exists idx_assignment_submissions_user_course on public.assignment_submissions(user_id, course_id);
create index if not exists idx_assignment_submissions_status on public.assignment_submissions(status);

-- Enable RLS
alter table public.course_assignments enable row level security;
alter table public.assignment_submissions enable row level security;

-- 3. RLS POLICIES FOR course_assignments
-- Anyone can view assignments for published courses
drop policy if exists "Anyone can select course assignments" on public.course_assignments;
create policy "Anyone can select course assignments"
  on public.course_assignments for select
  to authenticated, anon
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_assignments.course_id
        and c.status = 'published'
    )
    or public.is_admin()
  );

-- Admins can insert/update/delete assignments
drop policy if exists "Admins can manage course assignments" on public.course_assignments;
create policy "Admins can manage course assignments"
  on public.course_assignments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 4. RLS POLICIES FOR assignment_submissions
-- Students can select their own submissions, admins can select all
drop policy if exists "Users can select own submissions or admin" on public.assignment_submissions;
create policy "Users can select own submissions or admin"
  on public.assignment_submissions for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.is_admin()
  );

-- Enrolled students can insert their submission
drop policy if exists "Enrolled students can insert submission" on public.assignment_submissions;
create policy "Enrolled students can insert submission"
  on public.assignment_submissions for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and (
      exists (
        select 1 from public.enrollments e
        where e.course_id = assignment_submissions.course_id
          and e.user_id = auth.uid()
          and e.status = 'active'
      )
      or public.is_admin()
    )
  );

-- Students can update own submission before final approval, admins can update anytime (grade/feedback)
drop policy if exists "Users can update own submission or admin" on public.assignment_submissions;
create policy "Users can update own submission or admin"
  on public.assignment_submissions for update
  to authenticated
  using (
    (auth.uid() = user_id and status in ('submitted', 'rejected'))
    or public.is_admin()
  )
  with check (
    (auth.uid() = user_id and status in ('submitted', 'rejected'))
    or public.is_admin()
  );

-- 5. SEED INITIAL ASSIGNMENTS FOR SAMPLE COURSES
insert into public.course_assignments (id, course_id, title, description, requirements, due_days)
values
  (
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'Proyek Akhir: Membangun Web Portfolio Interaktif',
    'Buatlah sebuah website portfolio pribadi atau landing page produk menggunakan HTML5 semantik, styling responsif (CSS/Tailwind), serta interaktivitas JavaScript atau React. Unggah hasil kode Anda ke GitHub dan deploy ke platform gratis seperti Vercel, Netlify, atau GitHub Pages.',
    '["Struktur kode rapi & semantik", "Desain responsif di mobile & desktop", "Mengimplementasikan minimal 3 komponen interaktif", "Link repositori GitHub publik & live demo aktif"]'::jsonb,
    14
  ),
  (
    'a0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    'Proyek Akhir: Desain UI/UX Mobile App di Figma',
    'Rancanglah desain antarmuka aplikasi mobile (e-commerce atau edukasi) di Figma lengkap dengan Design System (color palette, typography, button variants) dan prototype interaktif minimal 5 layar.',
    '["Design system & token warna/tipografi yang konsisten", "Minimal 5 halaman/screen utama", "Prototype alur klik interaktif", "Link share Figma (view permission)"]'::jsonb,
    14
  ),
  (
    'a0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000003',
    'Proyek Akhir: Brand Guidelines & Visual Identity Kit',
    'Buatlah satu dokumen Brand Style Guide untuk sebuah startup fiktif atau bisnis UMKM lokal. Sertakan filosofi logo, aturan penggunaan warna, tipografi, dan mockup kemasan atau merchandise.',
    '["Logo primer dan alternatif", "Color palette (HEX & Pantone) dengan aturan kontras", "Tipografi primer & sekunder", "Mockup implementasi brand minimal 3 item"]'::jsonb,
    14
  ),
  (
    'a0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000004',
    'Proyek Akhir: Enterprise Dashboard Fullstack React & TS',
    'Kembangkan aplikasi dashboard analytics berskala enterprise dengan React, TypeScript, dan state management. Wajib memiliki otentikasi, visualisasi grafik data, dan penanganan loading/error state yang kuat.',
    '["Type-safe tanpa `any` dengan TypeScript strict", "Visualisasi grafik performa interaktif", "Penanganan caching data & optimistic UI", "Link GitHub repo & live deploy Vercel"]'::jsonb,
    21
  )
on conflict (course_id) do update set
  title = excluded.title,
  description = excluded.description,
  requirements = excluded.requirements,
  due_days = excluded.due_days;

