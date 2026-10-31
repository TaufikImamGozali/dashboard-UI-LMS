-- ==============================================================================
-- COURSUE LMS: SEED 16 COMPREHENSIVE COURSES, CURRICULUM LESSONS & CAPSTONE PROJECTS
-- Migration: 202610310003_seed_16_courses.sql
-- Description: Seeds the 16 courses requested with curriculum lessons and final project assignments
-- ==============================================================================

-- 1. PERLUAS CONSTRAINT KATEGORI PADA TABEL COURSES
-- Menambahkan kategori modern: ai, marketing, data, security, creative, softskills, finance, business
alter table public.courses drop constraint if exists courses_category_check;
alter table public.courses add constraint courses_category_check
  check (category in (
    'frontend', 'design', 'branding', 'mobile', 'devops', 'general',
    'ai', 'marketing', 'data', 'security', 'creative', 'softskills', 'finance', 'business'
  ));

-- 2. PASTIKAN TABEL COURSE_ASSIGNMENTS & ASSIGNMENT_SUBMISSIONS TERSEDIA
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

create index if not exists idx_course_assignments_course_id on public.course_assignments(course_id);
create index if not exists idx_assignment_submissions_user_course on public.assignment_submissions(user_id, course_id);
create index if not exists idx_assignment_submissions_status on public.assignment_submissions(status);

alter table public.course_assignments enable row level security;
alter table public.assignment_submissions enable row level security;

-- RLS Policies for course_assignments
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

drop policy if exists "Admins can manage course assignments" on public.course_assignments;
create policy "Admins can manage course assignments"
  on public.course_assignments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RLS Policies for assignment_submissions
drop policy if exists "Users can select own submissions or admin" on public.assignment_submissions;
create policy "Users can select own submissions or admin"
  on public.assignment_submissions for select
  to authenticated
  using (
    auth.uid() = user_id
    or public.is_admin()
  );

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

do $$
declare
  default_mentor_id uuid;
begin
  -- Resolve an existing mentor/admin profile, or leave null
  select id into default_mentor_id
  from public.profiles
  where role in ('mentor', 'admin')
  order by (role = 'mentor') desc, created_at asc
  limit 1;

  -- ---------------------------------------------------------------------------
  -- 16 COURSES INSERTION
  -- ---------------------------------------------------------------------------
  insert into public.courses (
    id, title, slug, description, thumbnail_url,
    category, level, price, status, mentor_id
  )
  values
    -- 01. Artificial Intelligence (AI) untuk Pemula
    (
      'c0000000-0000-0000-0000-000000000001',
      'Artificial Intelligence (AI) untuk Pemula',
      'ai-untuk-pemula',
      'Pelajari dasar AI, ChatGPT, prompt engineering, dan pemanfaatan AI untuk produktivitas sehari-hari.',
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
      'ai',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 02. Full Stack Web Development dari Nol
    (
      'c0000000-0000-0000-0000-000000000002',
      'Full Stack Web Development dari Nol',
      'full-stack-web-development-dari-nol',
      'Bangun website modern dengan HTML, CSS, JavaScript, React, dan backend.',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      'frontend',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 03. UI/UX Design: Dari Ide hingga Prototype
    (
      'c0000000-0000-0000-0000-000000000003',
      'UI/UX Design: Dari Ide hingga Prototype',
      'ui-ux-design-ide-prototype',
      'Kuasai Figma, design thinking, wireframe, dan desain aplikasi profesional.',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
      'design',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 04. Digital Marketing & Social Media Strategy
    (
      'c0000000-0000-0000-0000-000000000004',
      'Digital Marketing & Social Media Strategy',
      'digital-marketing-social-media-strategy',
      'Pelajari strategi pemasaran digital, SEO, iklan online, dan pengembangan brand.',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'marketing',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 05. Graphic Design & Visual Branding
    (
      'c0000000-0000-0000-0000-000000000005',
      'Graphic Design & Visual Branding',
      'graphic-design-visual-branding',
      'Belajar desain grafis, tipografi, identitas visual, dan branding menggunakan tools modern.',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
      'branding',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 06. Data Analytics untuk Pemula
    (
      'c0000000-0000-0000-0000-000000000006',
      'Data Analytics untuk Pemula',
      'data-analytics-untuk-pemula',
      'Mengolah dan memvisualisasikan data menggunakan Excel, SQL, dan Power BI.',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'data',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 07. Cybersecurity & Keamanan Digital
    (
      'c0000000-0000-0000-0000-000000000007',
      'Cybersecurity & Keamanan Digital',
      'cybersecurity-keamanan-digital',
      'Memahami keamanan akun, perlindungan data, ancaman siber, dan praktik keamanan digital.',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      'security',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 08. Video Editing & Content Creation
    (
      'c0000000-0000-0000-0000-000000000008',
      'Video Editing & Content Creation',
      'video-editing-content-creation',
      'Kuasai produksi konten, storytelling, CapCut, dan editing video untuk media sosial.',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      'creative',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 09. Public Speaking & Komunikasi Profesional
    (
      'c0000000-0000-0000-0000-000000000009',
      'Public Speaking & Komunikasi Profesional',
      'public-speaking-komunikasi-profesional',
      'Bangun kepercayaan diri, keterampilan presentasi, negosiasi, dan komunikasi efektif.',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
      'softskills',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 10. Financial Literacy & Personal Finance
    (
      'c0000000-0000-0000-0000-000000000010',
      'Financial Literacy & Personal Finance',
      'financial-literacy-personal-finance',
      'Belajar mengelola keuangan, menyusun anggaran, menabung, dan memahami dasar investasi.',
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
      'finance',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 11. Digital Entrepreneurship: Membangun Bisnis Online
    (
      'c0000000-0000-0000-0000-000000000011',
      'Digital Entrepreneurship: Membangun Bisnis Online',
      'digital-entrepreneurship-bisnis-online',
      'Pelajari cara memulai bisnis digital, riset pasar, strategi penjualan, dan pemasaran produk.',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      'business',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 12. AI Automation & No-Code Development
    (
      'c0000000-0000-0000-0000-000000000012',
      'AI Automation & No-Code Development',
      'ai-automation-no-code',
      'Membangun otomatisasi pekerjaan dan aplikasi sederhana menggunakan AI serta tools no-code.',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'ai',
      'intermediate',
      0,
      'published',
      default_mentor_id
    ),
    -- 13. English for Career & Daily Conversation
    (
      'c0000000-0000-0000-0000-000000000013',
      'English for Career & Daily Conversation',
      'english-for-career',
      'Tingkatkan kemampuan bahasa Inggris untuk wawancara, pekerjaan, dan komunikasi internasional.',
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
      'softskills',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 14. Project Management & Agile Fundamentals
    (
      'c0000000-0000-0000-0000-000000000014',
      'Project Management & Agile Fundamentals',
      'project-management-agile-fundamentals',
      'Pelajari manajemen proyek, Scrum, Kanban, kolaborasi tim, dan pengelolaan tugas.',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      'business',
      'intermediate',
      0,
      'published',
      default_mentor_id
    ),
    -- 15. Personal Branding & Career Development
    (
      'c0000000-0000-0000-0000-000000000015',
      'Personal Branding & Career Development',
      'personal-branding-career-development',
      'Bangun portofolio, optimalkan LinkedIn, susun CV, dan persiapkan karier profesional.',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      'softskills',
      'beginner',
      0,
      'published',
      default_mentor_id
    ),
    -- 16. Cloud Computing & DevOps Fundamentals
    (
      'c0000000-0000-0000-0000-000000000016',
      'Cloud Computing & DevOps Fundamentals',
      'cloud-computing-devops-fundamentals',
      'Pahami dasar cloud, Git/GitHub, deployment aplikasi, dan pengelolaan infrastruktur modern.',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      'devops',
      'intermediate',
      0,
      'published',
      default_mentor_id
    )
  on conflict (id) do update set
    title = excluded.title,
    slug = excluded.slug,
    description = excluded.description,
    thumbnail_url = excluded.thumbnail_url,
    category = excluded.category,
    level = excluded.level,
    price = excluded.price,
    status = excluded.status;

  -- ---------------------------------------------------------------------------
  -- SEED SAMPLE LESSONS FOR EACH COURSE
  -- ---------------------------------------------------------------------------
  -- Course 1: AI untuk Pemula
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Pengenalan Kecerdasan Buatan & ChatGPT', 'Memahami konsep dasar AI, Generative AI, dan Large Language Models.', 'https://www.youtube.com/watch?v=2eWuYf-aZE4', '2eWuYf-aZE4', 1800, 1, true),
    ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Seni Prompt Engineering untuk Produktivitas', 'Teknik menyusun prompt terstruktur: role, context, constraints, few-shot prompts.', 'https://www.youtube.com/watch?v=jC4v5AS4RIM', 'jC4v5AS4RIM', 2400, 2, false),
    ('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Pemanfaatan AI Tools dalam Alur Kerja Harian', 'Integrasi AI untuk riset, penulisan konten, ringkasan dokumen, dan otomatisasi tugas.', 'https://www.youtube.com/watch?v=b-hZ_b0e_48', 'b-hZ_b0e_48', 2100, 3, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds;

  -- Course 2: Full Stack Web Development dari Nol
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'HTML5 Semantik & Dasar Web', 'Belajar struktur dokumen HTML5, tag semantik, dan formulir web.', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 'kUMe1FH4CHE', 3600, 1, true),
    ('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'CSS Flexbox, Grid & Responsive Design', 'Menguasai layout modern yang ramah perangkat mobile dan desktop.', 'https://www.youtube.com/watch?v=yfoY53QXEnI', 'yfoY53QXEnI', 4200, 2, false),
    ('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'React & State Management untuk Pemula', 'Komponen, Props, useState, useEffect, dan interaktivitas aplikasi web.', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'SqcY0GlETPk', 3600, 3, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url;

  -- Course 3: UI/UX Design: Dari Ide hingga Prototype
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003', 'Dasar Design Thinking & User Research', 'Memahami empati pengguna, persona, dan perumusan masalah UX.', 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', 'c9Wg6Cb_YlU', 1800, 1, true),
    ('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003', 'Wireframing & Desain Komponen di Figma', 'Auto layout, constraints, styles, dan token warna di Figma.', 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', 'FTFaQWZBqQ8', 3600, 2, false),
    ('b0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003', 'Interactive Prototyping & Usability Testing', 'Menghubungkan screen, transisi mikro animasi, dan pengujian ke pengguna.', 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', 'w7ejDZ8SWv8', 2700, 3, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url;

  -- Course 4: Digital Marketing & Social Media Strategy
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000004', 'Pengenalan Digital Marketing & Funnel Pemasaran', 'Dasar digital marketing, awareness, consideration, conversion, dan retention.', 'https://www.youtube.com/watch?v=bixR-KIJKYM', 'bixR-KIJKYM', 2400, 1, true),
    ('b0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000004', 'Dasar SEO & Content Marketing', 'Keyword research, on-page SEO, backlink, dan strategi konten organik.', 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', 'DvwS7cV9GmQ', 3000, 2, false),
    ('b0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000004', 'Iklan Berbayar (Meta Ads & Google Ads)', 'Menyusun campaign, targeting audiens, dan kalkulasi ROI/ROAS iklan.', 'https://www.youtube.com/watch?v=1bPEq4i_XfQ', '1bPEq4i_XfQ', 3200, 3, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url;

  -- Course 5: Graphic Design & Visual Branding
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000005', 'Prinsip Desain Grafis & Komposisi Visual', 'Hirarki visual, balance, contrast, alignment, dan whitespace dalam desain.', 'https://www.youtube.com/watch?v=YqQx75OPWA0', 'YqQx75OPWA0', 2100, 1, true),
    ('b0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000005', 'Tipografi & Teori Warna untuk Identitas Brand', 'Pemilihan font pairing, psikologi warna, dan pembuatan palette brand.', 'https://www.youtube.com/watch?v=sByzHoiYFX0', 'sByzHoiYFX0', 2700, 2, false),
    ('b0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000005', 'Merancang Brand Guideline Profesional', 'Menyusun aset visual, logo usage, dan mockups identitas bisnis.', 'https://www.youtube.com/watch?v=Z3k3bC-B5gM', 'Z3k3bC-B5gM', 3100, 3, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url;

  -- Course 6: Data Analytics untuk Pemula
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000006', 'Pengantar Analisis Data & Microsoft Excel', 'Data cleaning, formula dasar (VLOOKUP, INDEX/MATCH), dan Pivot Table.', 'https://www.youtube.com/watch?v=ox7XFm-05VU', 'ox7XFm-05VU', 2700, 1, true),
    ('b0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000006', 'SQL Dasar untuk Pengambilan Data', 'SELECT, WHERE, GROUP BY, JOIN, dan agregasi data dari database.', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', '7S_tz1z_5bA', 3300, 2, false),
    ('b0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000006', 'Visualisasi Data Interaktif dengan Power BI', 'Membuat dashboard analitik bisnis, kartu KPI, dan chart interaktif.', 'https://www.youtube.com/watch?v=AGrl-H87pRU', 'AGrl-H87pRU', 3600, 3, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url;

  -- ---------------------------------------------------------------------------
  -- CAPSTONE ASSIGNMENTS FOR COURSES
  -- ---------------------------------------------------------------------------
  insert into public.course_assignments (id, course_id, title, description, requirements, due_days)
  values
    (
      'a0000000-0000-0000-0000-000000000001',
      'c0000000-0000-0000-0000-000000000001',
      'Proyek Akhir: Penyusunan AI Prompting Guidebook',
      'Buatlah panduan studi kasus prompt engineering lengkap dengan perbandingan output sebelum dan sesudah optimasi prompt.',
      '["Minimal 3 skenario tugas praktis", "Perbandingan output raw vs refined", "Dokumentasi format PDF atau Notion link"]'::jsonb,
      14
    ),
    (
      'a0000000-0000-0000-0000-000000000002',
      'c0000000-0000-0000-0000-000000000002',
      'Proyek Akhir: Membangun Web Portfolio Interaktif',
      'Buatlah website portfolio modern menggunakan React dan Tailwind CSS, lalu deploy ke Vercel atau GitHub Pages.',
      '["Struktur kode rapi & semantik", "Desain responsif di mobile & desktop", "Link repositori GitHub & live demo aktif"]'::jsonb,
      14
    ),
    (
      'a0000000-0000-0000-0000-000000000003',
      'c0000000-0000-0000-0000-000000000003',
      'Proyek Akhir: Prototype Aplikasi Mobile di Figma',
      'Rancang desain antarmuka mobile apps lengkap dengan Design System dan prototype interaktif minimal 5 layar.',
      '["Design system & color palette", "Minimal 5 halaman/screen utama", "Prototype alur klik interaktif", "Link share Figma view access"]'::jsonb,
      14
    ),
    (
      'a0000000-0000-0000-0000-000000000004',
      'c0000000-0000-0000-0000-000000000004',
      'Proyek Akhir: Rencana Kampanye Digital Marketing Terpadu',
      'Susun dokumen strategi pemasaran digital untuk produk fiktif atau UMKM lokal, mencakup persona target, konten pilar, dan estimasi budget iklan.',
      '["Analisis target audiens & buyer persona", "Content calendar 30 hari", "Perencanaan channel organik & berbayar"]'::jsonb,
      14
    ),
    (
      'a0000000-0000-0000-0000-000000000005',
      'c0000000-0000-0000-0000-000000000005',
      'Proyek Akhir: Brand Identity & Visual Guidelines',
      'Rancang paket identitas visual brand meliputi logo, pedoman warna, tipografi, dan implementasi mockup kemasan produk.',
      '["Logo primer & sekunder", "Color codes HEX & Pantone", "3 Mockup implementasi fisik/digital"]'::jsonb,
      14
    ),
    (
      'a0000000-0000-0000-0000-000000000006',
      'c0000000-0000-0000-0000-000000000006',
      'Proyek Akhir: Dashboard Analitik Bisnis di Power BI / Excel',
      'Olah dataset penjualan publik, bersihkan data, dan buat visualisasi dashboard interaktif yang menyajikan minimal 4 insight bisnis penting.',
      '["Dataset yang telah dibersihkan", "Minimal 3 visualisasi interaktif & kartu KPI", "Ringkasan insight eksekutif"]'::jsonb,
      14
    )
  on conflict (course_id) do update set
    title = excluded.title,
    description = excluded.description,
    requirements = excluded.requirements;

end $$;
