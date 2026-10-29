-- ==============================================================================
-- COURSUE LMS: SAMPLE SEED DATA (COURSES & LESSONS)
-- File: supabase/seed_lms_courses.sql
-- Description: 4 sample courses (2 free, 2 paid) across frontend, design, and branding
--              with real public educational YouTube lessons.
-- ==============================================================================

do $$
declare
  default_mentor_id uuid;
begin
  -- Resolve an existing mentor/admin profile, or leave null if none exists
  select id into default_mentor_id
  from public.profiles
  where role in ('mentor', 'admin')
  order by (role = 'mentor') desc, created_at asc
  limit 1;

  -- ---------------------------------------------------------------------------
  -- COURSE 1: FRONTEND DEVELOPER (FREE)
  -- ---------------------------------------------------------------------------
  insert into public.courses (
    id, title, slug, description, thumbnail_url,
    category, level, price, status, mentor_id
  )
  values (
    'c0000000-0000-0000-0000-000000000001',
    'Beginner''s Guide to Becoming a Professional Front-End Developer',
    'beginners-guide-frontend-developer',
    'Master the foundational and modern tools of frontend development. From semantic HTML5, modern responsive Tailwind CSS, to modern JavaScript and React.',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    'frontend',
    'beginner',
    0,
    'published',
    default_mentor_id
  )
  on conflict (id) do update set
    title = excluded.title,
    slug = excluded.slug,
    description = excluded.description,
    price = excluded.price,
    status = excluded.status,
    category = excluded.category,
    level = excluded.level;

  insert into public.lessons (
    id, course_id, title, description, youtube_url,
    youtube_video_id, duration_seconds, position, is_preview
  )
  values
    (
      'b0000000-0000-0000-0000-000000000001',
      'c0000000-0000-0000-0000-000000000001',
      'HTML Crash Course for Absolute Beginners',
      'Learn semantic HTML5 tags, document structures, forms, inputs, and accessible markup.',
      'https://www.youtube.com/watch?v=kUMe1FH4CHE',
      'kUMe1FH4CHE',
      3600,
      1,
      true
    ),
    (
      'b0000000-0000-0000-0000-000000000002',
      'c0000000-0000-0000-0000-000000000001',
      'CSS Crash Course: Flexbox, Grid & Responsive Layouts',
      'Understand the CSS box model, responsive media queries, Flexbox alignment, and CSS Grid.',
      'https://www.youtube.com/watch?v=yfoY53QXEnI',
      'yfoY53QXEnI',
      4200,
      2,
      false
    ),
    (
      'b0000000-0000-0000-0000-000000000003',
      'c0000000-0000-0000-0000-000000000001',
      'JavaScript Fundamentals & DOM Manipulation',
      'Core JavaScript syntax, variables, arrow functions, promises, and interacting with browser DOM.',
      'https://www.youtube.com/watch?v=hdI2bqOjy3c',
      'hdI2bqOjy3c',
      5400,
      3,
      false
    ),
    (
      'b0000000-0000-0000-0000-000000000004',
      'c0000000-0000-0000-0000-000000000001',
      'Modern React: Components, Props, and State',
      'Introduction to component-driven architecture, JSX syntax, and React state hooks.',
      'https://www.youtube.com/watch?v=SqcY0GlETPk',
      'SqcY0GlETPk',
      4800,
      4,
      false
    )
  on conflict (id) do update set
    title = excluded.title,
    description = excluded.description,
    youtube_url = excluded.youtube_url,
    youtube_video_id = excluded.youtube_video_id,
    duration_seconds = excluded.duration_seconds,
    position = excluded.position,
    is_preview = excluded.is_preview;

  -- ---------------------------------------------------------------------------
  -- COURSE 2: ADVANCED REACT & TYPESCRIPT (PAID)
  -- ---------------------------------------------------------------------------
  insert into public.courses (
    id, title, slug, description, thumbnail_url,
    category, level, price, status, mentor_id
  )
  values (
    'c0000000-0000-0000-0000-000000000002',
    'Advanced React 18 & TypeScript Architecture',
    'advanced-react-typescript-architecture',
    'Deep dive into clean architecture, custom hooks design, performance profiling, state machines, and type-safe React development.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    'frontend',
    'advanced',
    49.00,
    'published',
    default_mentor_id
  )
  on conflict (id) do update set
    title = excluded.title,
    slug = excluded.slug,
    description = excluded.description,
    price = excluded.price,
    status = excluded.status,
    category = excluded.category,
    level = excluded.level;

  insert into public.lessons (
    id, course_id, title, description, youtube_url,
    youtube_video_id, duration_seconds, position, is_preview
  )
  values
    (
      'b0000000-0000-0000-0000-000000000005',
      'c0000000-0000-0000-0000-000000000002',
      'TypeScript Foundations for Senior React Developers',
      'Master interfaces, union types, discrimination, and typing polymorphic components.',
      'https://www.youtube.com/watch?v=BCg4qkDu350',
      'BCg4qkDu350',
      3900,
      1,
      true
    ),
    (
      'b0000000-0000-0000-0000-000000000006',
      'c0000000-0000-0000-0000-000000000002',
      'Designing Resilient Custom React Hooks',
      'Abstracting business logic, lifecycle management, and clean hook boundaries.',
      'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
      '0ZJgIjIuY7U',
      2800,
      2,
      false
    ),
    (
      'b0000000-0000-0000-0000-000000000007',
      'c0000000-0000-0000-0000-000000000002',
      'Server State with TanStack Query and Cache Hydration',
      'Optimistic updates, pagination, query invalidation, and deduplication patterns.',
      'https://www.youtube.com/watch?v=7YhdqIR2Yzo',
      '7YhdqIR2Yzo',
      3400,
      3,
      false
    ),
    (
      'b0000000-0000-0000-0000-000000000008',
      'c0000000-0000-0000-0000-000000000002',
      'Performance Optimization & Core Web Vitals',
      'Profiler tools, React memoization strategies, code-splitting, and render tuning.',
      'https://www.youtube.com/watch?v=QAZsw8nK2Q0',
      'QAZsw8nK2Q0',
      4100,
      4,
      false
    )
  on conflict (id) do update set
    title = excluded.title,
    description = excluded.description,
    youtube_url = excluded.youtube_url,
    youtube_video_id = excluded.youtube_video_id,
    duration_seconds = excluded.duration_seconds,
    position = excluded.position,
    is_preview = excluded.is_preview;

  -- ---------------------------------------------------------------------------
  -- COURSE 3: UI/UX DESIGN WITH FIGMA (FREE)
  -- ---------------------------------------------------------------------------
  insert into public.courses (
    id, title, slug, description, thumbnail_url,
    category, level, price, status, mentor_id
  )
  values (
    'c0000000-0000-0000-0000-000000000003',
    'Mastering UI/UX Design with Figma',
    'mastering-ui-ux-design-figma',
    'Learn professional UI design from wireframes to high-fidelity clickable prototypes with Figma auto-layout and design systems.',
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
    'design',
    'intermediate',
    0,
    'published',
    default_mentor_id
  )
  on conflict (id) do update set
    title = excluded.title,
    slug = excluded.slug,
    description = excluded.description,
    price = excluded.price,
    status = excluded.status,
    category = excluded.category,
    level = excluded.level;

  insert into public.lessons (
    id, course_id, title, description, youtube_url,
    youtube_video_id, duration_seconds, position, is_preview
  )
  values
    (
      'b0000000-0000-0000-0000-000000000009',
      'c0000000-0000-0000-0000-000000000003',
      'Figma Essentials & Workspace Navigation',
      'Setup frames, vector tools, grid systems, and essential shortcuts for fast UI design.',
      'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
      'c9Wg6Cb_YlU',
      2900,
      1,
      true
    ),
    (
      'b0000000-0000-0000-0000-000000000010',
      'c0000000-0000-0000-0000-000000000003',
      'Typography Hierarchy & Color Systems',
      'Creating scalable font scales, accessible contrast ratios, and cohesive UI color palettes.',
      'https://www.youtube.com/watch?v=7Z16B_bFmXo',
      '7Z16B_bFmXo',
      2100,
      2,
      false
    ),
    (
      'b0000000-0000-0000-0000-000000000011',
      'c0000000-0000-0000-0000-000000000003',
      'Figma Auto-Layout & Responsive Components',
      'Build real responsive buttons, cards, navigation headers, and flexible nested layouts.',
      'https://www.youtube.com/watch?v=TxsXJzN_N1g',
      'TxsXJzN_N1g',
      3100,
      3,
      false
    ),
    (
      'b0000000-0000-0000-0000-000000000012',
      'c0000000-0000-0000-0000-000000000003',
      'Interactive Prototyping & Smart Animate',
      'Wire user flows with smart animation, overlays, variants, and interactive components.',
      'https://www.youtube.com/watch?v=cOwhX4Tud4g',
      'cOwhX4Tud4g',
      2600,
      4,
      false
    )
  on conflict (id) do update set
    title = excluded.title,
    description = excluded.description,
    youtube_url = excluded.youtube_url,
    youtube_video_id = excluded.youtube_video_id,
    duration_seconds = excluded.duration_seconds,
    position = excluded.position,
    is_preview = excluded.is_preview;

  -- ---------------------------------------------------------------------------
  -- COURSE 4: BRAND IDENTITY DESIGN (PAID)
  -- ---------------------------------------------------------------------------
  insert into public.courses (
    id, title, slug, description, thumbnail_url,
    category, level, price, status, mentor_id
  )
  values (
    'c0000000-0000-0000-0000-000000000004',
    'Brand Identity Design: From Concept to Guidelines',
    'brand-identity-concept-to-guidelines',
    'Craft comprehensive corporate brand identities, logo systems, typography palettes, and client-ready style guides.',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    'branding',
    'intermediate',
    35.00,
    'published',
    default_mentor_id
  )
  on conflict (id) do update set
    title = excluded.title,
    slug = excluded.slug,
    description = excluded.description,
    price = excluded.price,
    status = excluded.status,
    category = excluded.category,
    level = excluded.level;

  insert into public.lessons (
    id, course_id, title, description, youtube_url,
    youtube_video_id, duration_seconds, position, is_preview
  )
  values
    (
      'b0000000-0000-0000-0000-000000000013',
      'c0000000-0000-0000-0000-000000000004',
      'Brand Strategy & Core Proposition',
      'Discovering brand archetypes, tone of voice, values, and competitive positioning.',
      'https://www.youtube.com/watch?v=Zomw2FwzWos',
      'Zomw2FwzWos',
      2400,
      1,
      true
    ),
    (
      'b0000000-0000-0000-0000-000000000014',
      'c0000000-0000-0000-0000-000000000004',
      'Designing Versatile Logo Systems',
      'From sketch to vector: logomarks, wordmarks, favicon variants, and responsive logo lockups.',
      'https://www.youtube.com/watch?v=d6y6w_Kj3mE',
      'd6y6w_Kj3mE',
      3300,
      2,
      false
    ),
    (
      'b0000000-0000-0000-0000-000000000015',
      'c0000000-0000-0000-0000-000000000004',
      'Creating Client-Ready Brand Style Guides',
      'Documenting color tokens, clearspace rules, do & don''ts, and asset handoff packages.',
      'https://www.youtube.com/watch?v=U2kZJj8k-y4',
      'U2kZJj8k-y4',
      2700,
      3,
      false
    )
  on conflict (id) do update set
    title = excluded.title,
    description = excluded.description,
    youtube_url = excluded.youtube_url,
    youtube_video_id = excluded.youtube_video_id,
    duration_seconds = excluded.duration_seconds,
    position = excluded.position,
    is_preview = excluded.is_preview;

end $$;
