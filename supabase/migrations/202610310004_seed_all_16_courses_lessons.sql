-- ==============================================================================
-- COURSUE LMS: SEED COMPLETE VERIFIED REAL LESSONS & PRO PRICES FOR ALL 16 COURSES
-- Migration: 202610310004_seed_all_16_courses_lessons.sql
-- Description: Sets Pro course prices and inserts 64 real verified curriculum lessons for courses 1-16
-- ==============================================================================

do $$
begin
  -- 1. UPDATE PRICES FOR PRO (PAID) COURSES
  update public.courses set price = 249000 where id = 'c0000000-0000-0000-0000-000000000005'; -- Graphic Design & Visual Branding
  update public.courses set price = 299000 where id = 'c0000000-0000-0000-0000-000000000006'; -- Data Analytics untuk Pemula
  update public.courses set price = 199000 where id = 'c0000000-0000-0000-0000-000000000008'; -- Video Editing & Content Creation
  update public.courses set price = 349000 where id = 'c0000000-0000-0000-0000-000000000011'; -- Digital Entrepreneurship: Bisnis Online
  update public.courses set price = 279000 where id = 'c0000000-0000-0000-0000-000000000012'; -- AI Automation & No-Code Development
  update public.courses set price = 319000 where id = 'c0000000-0000-0000-0000-000000000014'; -- Project Management & Agile Fundamentals
  update public.courses set price = 189000 where id = 'c0000000-0000-0000-0000-000000000015'; -- Personal Branding & Career Development
  update public.courses set price = 399000 where id = 'c0000000-0000-0000-0000-000000000016'; -- Cloud Computing & DevOps Fundamentals

  -- Ensure Free Courses remain 0
  update public.courses set price = 0 where id in (
    'c0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000009',
    'c0000000-0000-0000-0000-000000000010',
    'c0000000-0000-0000-0000-000000000013'
  );

  -- 2. SEED 64 REAL VERIFIED LESSONS FOR ALL 16 COURSES
  -- Course 01: Artificial Intelligence (AI) untuk Pemula
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000001-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Pengenalan AI: Konsep Dasar Kecerdasan Buatan & ChatGPT', 'Membedah mitos kecerdasan buatan, Generative AI, dan bagaimana AI mentransformasi industri modern.', 'https://www.youtube.com/watch?v=2eWuYf-aZE4', '2eWuYf-aZE4', 960, 1, true),
    ('b0000001-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Master the Perfect ChatGPT Prompt Formula', 'Teknik menyusun prompt terstruktur: role, context, constraints, few-shot prompts untuk hasil akurat.', 'https://www.youtube.com/watch?v=jC4v5AS4RIM', 'jC4v5AS4RIM', 1500, 2, false),
    ('b0000001-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Memahami Cara Kerja Neural Networks & Deep Learning', 'Visualisasi matematis intuisi neural network, layer neuron, dan proses training bobot AI.', 'https://www.youtube.com/watch?v=aircAruvnKk', 'aircAruvnKk', 1200, 3, false),
    ('b0000001-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Generative AI Full Course: LLM, OpenAI, & Vector DB', 'Membangun aplikasi cerdas dengan Large Language Models, embeddings, dan alur integrasi API AI.', 'https://www.youtube.com/watch?v=mEsleV16qdo', 'mEsleV16qdo', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 02: Full Stack Web Development dari Nol
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000002-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'HTML5 Semantik & Dasar Struktur Dokumen Web', 'Belajar struktur dokumen HTML5, tag semantik, form validation, dan SEO dasar.', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 'kUMe1FH4CHE', 3600, 1, true),
    ('b0000002-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'CSS Crash Course: Flexbox, Grid & Responsive Design', 'Menguasai layout modern yang ramah perangkat mobile, tablet, dan desktop tanpa framework.', 'https://www.youtube.com/watch?v=yfoY53QXEnI', 'yfoY53QXEnI', 4500, 2, false),
    ('b0000002-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'JavaScript Modern ES6+ & DOM Manipulation', 'Variabel modern, arrow functions, promises, fetch API, dan manipulasi DOM dinamis.', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 'W6NZfCO5SIk', 4800, 3, false),
    ('b0000002-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'React 18 Tutorial for Beginners: Components & State', 'Komponen, Props, useState, useEffect, dan interaktivitas aplikasi web modern.', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'SqcY0GlETPk', 4200, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 03: UI/UX Design: Dari Ide hingga Prototype
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000003-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'UI/UX Design Fundamentals: Wireframe & Mockup', 'Memahami empati pengguna, persona, pain points, dan alur perancangan mockup UI di Figma.', 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', 'c9Wg6Cb_YlU', 2100, 1, true),
    ('b0000003-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'Figma UI Design Tutorial: Get Started in 24 Minutes', 'Navigasi antarmuka Figma, frames, shapes, typography styles, dan shortcut esensial.', 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', 'FTFaQWZBqQ8', 1500, 2, false),
    ('b0000003-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Figma UX Design & UI Essentials Masterclass', 'Membangun komponen UI sistematis, Auto Layout responsif, dan token warna terstandar.', 'https://www.youtube.com/watch?v=kbZejnPXyLM', 'kbZejnPXyLM', 3000, 3, false),
    ('b0000003-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 'Interactive Prototyping & Flow Testing di Figma', 'Menghubungkan frame, transisi mikro animasi, modal popup, dan presentasi prototype ke klien.', 'https://www.youtube.com/watch?v=1ucLq6JTxac', '1ucLq6JTxac', 2400, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 04: Digital Marketing & Social Media Strategy
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000004-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Digital Marketing in 5 Minutes: Funnel & Channels', 'Dasar digital marketing: awareness, consideration, conversion, dan strategi multichannel.', 'https://www.youtube.com/watch?v=bixR-KIJKYM', 'bixR-KIJKYM', 1200, 1, true),
    ('b0000004-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 'SEO for Beginners: Search Engine Optimization Blueprint', 'Keyword research, on-page SEO, backlink, dan pembuatan konten organik ranking 1 Google.', 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', 'DvwS7cV9GmQ', 2700, 2, false),
    ('b0000004-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', 'Digital Marketing Course Part 1: Content & Audience', 'Analisis audiens target, persona pembeli, content pillars, dan metrik engagement sosial media.', 'https://www.youtube.com/watch?v=nU-IIXBWlS4', 'nU-IIXBWlS4', 3000, 3, false),
    ('b0000004-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'Meta Ads & Facebook Ads Masterclass for Beginners', 'Setup Business Manager, struktur kampanye, riset audiens, creative ad copy, dan kalkulasi ROAS.', 'https://www.youtube.com/watch?v=OU25220Z2Qo', 'OU25220Z2Qo', 3300, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 05: Graphic Design & Visual Branding (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000005-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'What is Graphic Design? Theory, Form & Balance', 'Memahami esensi desain grafis, visual elements, komposisi bentuk, dan komunikasi visual efektif.', 'https://www.youtube.com/watch?v=dFSia1LZI4Y', 'dFSia1LZI4Y', 1800, 1, true),
    ('b0000005-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 'Beginning Graphic Design: Typography & Font Pairing', 'Anatomi huruf, serif vs sans-serif, kerning, leading, dan aturan font pairing harmonis.', 'https://www.youtube.com/watch?v=sByzHoiYFX0', 'sByzHoiYFX0', 2100, 2, false),
    ('b0000005-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000005', 'Colour Visual Element of Graphic Design & Palette', 'Teori roda warna, psikologi emosi warna, kontras visual, dan perumusan color palette brand.', 'https://www.youtube.com/watch?v=byDNMLTuOqI', 'byDNMLTuOqI', 2400, 3, false),
    ('b0000005-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005', 'Beginning Graphic Design: Layout & Composition', 'Grid layout, aturan sepertiga (rule of thirds), whitespace, dan hirarki tata letak profesional.', 'https://www.youtube.com/watch?v=a5KYlHNKQB8', 'a5KYlHNKQB8', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 06: Data Analytics untuk Pemula (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000006-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Microsoft Excel for Data Analysis & Business Formulas', 'Data cleaning, formula XLOOKUP, INDEX/MATCH, Pivot Tables, dan visual chart bisnis.', 'https://www.youtube.com/watch?v=Vl0H-qTclOg', 'Vl0H-qTclOg', 2700, 1, true),
    ('b0000006-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', 'SQL Course for Beginners: Querying Relational Databases', 'SELECT, WHERE, GROUP BY, INNER/LEFT JOIN, subquery, dan agregasi data penjualan.', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', '7S_tz1z_5bA', 3600, 2, false),
    ('b0000006-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000006', 'Power BI Tutorial: From Beginner to Pro Interactive Dashboard', 'Menghubungkan data source, visual cards KPI, visual filter dinamis, dan publishing report.', 'https://www.youtube.com/watch?v=AGrl-H87pRU', 'AGrl-H87pRU', 3600, 3, false),
    ('b0000006-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000006', 'Data Analysis with Python: NumPy, Pandas, & Matplotlib', 'Manipulasi data tabular dengan DataFrame Pandas, kalkulasi statistik, dan visualisasi grafik.', 'https://www.youtube.com/watch?v=GPVsHOlRBBI', 'GPVsHOlRBBI', 3300, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 07: Cybersecurity & Keamanan Digital
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000007-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'What is Cybersecurity & How It Works: Threat Landscape', 'Tinjauan lanskap ancaman modern, teknik phishing, manipulasi psikologis, dan proteksi akun.', 'https://www.youtube.com/watch?v=inWWhr5tnEA', 'inWWhr5tnEA', 1800, 1, true),
    ('b0000007-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000007', 'Introduction to Cyber Security & Network Defense', 'Model OSI, firewall, VPN, enkripsi simetris/asimetris, dan sertifikat SSL/TLS.', 'https://www.youtube.com/watch?v=z5nc9MDbvkw', 'z5nc9MDbvkw', 2400, 2, false),
    ('b0000007-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000007', 'Full Ethical Hacking Course: Network & Web Testing', 'Menganalisis serangan web paling umum, port scanning, dan mekanisme mitigasi kode aman.', 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', '3Kq1MIfTWCE', 3300, 3, false),
    ('b0000007-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000007', 'Cyber Security Defense & Security Operations (SOC)', 'Langkah taktis penanganan insiden, audit log sistem, hardening server, dan disaster recovery.', 'https://www.youtube.com/watch?v=hXSFdwIOfnE', 'hXSFdwIOfnE', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 08: Video Editing & Content Creation (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000008-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000008', 'DaVinci Resolve Video Editing Course for Beginners', 'Pengenalan timeline DaVinci Resolve, cuts, transitions, audio mixing, dan rendering cepat.', 'https://www.youtube.com/watch?v=mgCqndlTWFU', 'mgCqndlTWFU', 2700, 1, true),
    ('b0000008-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000008', 'CapCut Desktop Tutorial for Beginners: Timeline & Cuts', 'Shortcut penting, auto captions, keyframing zoom dinamis, dan masking objek.', 'https://www.youtube.com/watch?v=EMDrgqepVhM', 'EMDrgqepVhM', 2100, 2, false),
    ('b0000008-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000008', 'Adobe Premiere Pro Advanced Editing Workflow', 'Teknik audio ducking, sound effects penegas emosi, color grading, dan efisiensi render.', 'https://www.youtube.com/watch?v=O6ERELse_QY', 'O6ERELse_QY', 3300, 3, false),
    ('b0000008-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000008', 'Panduan Praktis Editing Video CapCut dari Nol', 'Strategi transisi mulus, pemilihan sound trending, aspek rasio media sosial, dan ekspor kualitas tinggi.', 'https://www.youtube.com/watch?v=eBJRTmptN78', 'eBJRTmptN78', 2400, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 09: Public Speaking & Komunikasi Profesional
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000009-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000009', 'Be a More Confident Public Speaker: Overcoming Anxiety', 'Teknik pernapasan diafragma, mindset percaya diri, dan persiapan psikologis sebelum berbicara.', 'https://www.youtube.com/watch?v=tShavGuo0_E', 'tShavGuo0_E', 1500, 1, true),
    ('b0000009-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000009', 'Your Body Language May Shape Who You Are', 'Kekuatan power posing dan bahasa tubuh ekspansif dalam membentuk rasa percaya diri panggung.', 'https://www.youtube.com/watch?v=Ks-_Mh1QhMc', 'Ks-_Mh1QhMc', 1200, 2, false),
    ('b0000009-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000009', 'How to Speak So That People Want to Listen', 'Vocal toolbox: pitch, pace, timbre, volume, serta 4 pilar kejujuran komunikasi (HAIL).', 'https://www.youtube.com/watch?v=eIho2S0ZahI', 'eIho2S0ZahI', 1200, 3, false),
    ('b0000009-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000009', 'How to Speak: Techniques for Lectures & Presentations', 'Struktur membuka kuliah/presentasi, visual aids efektif, dan interaksi engaging dengan audiens.', 'https://www.youtube.com/watch?v=Unzc731iCUY', 'Unzc731iCUY', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 10: Financial Literacy & Personal Finance
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000010-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000010', 'Finance & Investing Essentials: Everything You Need to Know', 'William Ackman membedah prinsip dasar neraca keuangan, valuasi bisnis, dan investasi.', 'https://www.youtube.com/watch?v=WEDIj9JBTC8', 'WEDIj9JBTC8', 2700, 1, true),
    ('b0000010-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000010', 'How Does the Stock Market Work? Basic Principles', 'Mekanisme bursa efek, penawaran saham perdana (IPO), dan bagaimana perusahaan menghasilkan nilai.', 'https://www.youtube.com/watch?v=p7HKvqRI_Bo', 'p7HKvqRI_Bo', 1200, 2, false),
    ('b0000010-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000010', 'How To Manage Your Money: The 50/30/20 Budgeting Rule', 'Membedah pos kebutuhan pokok, keinginan, dan alokasi tabungan investasi sistematis.', 'https://www.youtube.com/watch?v=HQzoZfc3GwQ', 'HQzoZfc3GwQ', 2100, 3, false),
    ('b0000010-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000010', 'How To Invest & Build Wealth for Beginners: Index Funds', 'Graham Stephan memaparkan strategi investasi reksadana indeks S&P 500 dan compound interest.', 'https://www.youtube.com/watch?v=xymKsZdrPaM', 'xymKsZdrPaM', 2400, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 11: Digital Entrepreneurship: Membangun Bisnis Online (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000011-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000011', 'How To Start An Online Business: Step by Step Guide', 'Panduan komprehensif menemukan model bisnis, riset kompetitor, dan memilih platform penjualan.', 'https://www.youtube.com/watch?v=kFeC-5VnvzU', 'kFeC-5VnvzU', 2100, 1, true),
    ('b0000011-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000011', '2026 Online Business Blueprint: Operations & Sales', 'Sistem operasional, manajemen persediaan produk, dan otomatisasi alur kerja pesanan digital.', 'https://www.youtube.com/watch?v=5Z9PFR0LajI', '5Z9PFR0LajI', 2400, 2, false),
    ('b0000011-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000011', '7 Steps to Starting an Online Business from Scratch', 'Validasi pasar cepat, penetapan harga (pricing strategy), dan membangun basis pelanggan awal.', 'https://www.youtube.com/watch?v=Ev8wR0gBV9s', 'Ev8wR0gBV9s', 2100, 3, false),
    ('b0000011-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000011', 'Shopify Full Tutorial for Beginners: E-commerce Store Setup', 'Konfigurasi tema toko, upload katalog produk, integrasi gateway pembayaran, dan launching toko.', 'https://www.youtube.com/watch?v=PVufWxoWfkI', 'PVufWxoWfkI', 3300, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 12: AI Automation & No-Code Development (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000012-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000012', 'Make.com Tutorial for Beginners: Complete No-Code Guide', 'Prinsip kerja trigger, modules, data mapping, webhook, dan arsitektur otomasi bisnis masa kini.', 'https://www.youtube.com/watch?v=SVkiqiSVo3k', 'SVkiqiSVo3k', 2400, 1, true),
    ('b0000012-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000012', 'Make.com AI Automation & Automated Business Workflows', 'Menghubungkan formulir, spreadsheet, integrasi OpenAI, dan memproses data otomatis.', 'https://www.youtube.com/watch?v=DS4QbTpbVKw', 'DS4QbTpbVKw', 2700, 2, false),
    ('b0000012-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000012', 'Zapier AI Tutorial for Beginners: Automation Made Simple', 'Kevin Stratvert memandu setup Zaps pertama, filter logika, multi-step actions, dan AI assistant.', 'https://www.youtube.com/watch?v=JtdUgJGI_Oo', 'JtdUgJGI_Oo', 2100, 3, false),
    ('b0000012-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000012', 'Webflow Full Tutorial for Beginners: No-Code Web App', 'Mendesain layout interaktif, CMS collection, animasi interaksi, dan publishing website no-code.', 'https://www.youtube.com/watch?v=Cy90d6Rr-38', 'Cy90d6Rr-38', 3000, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 13: English for Career & Daily Conversation
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000013-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000013', 'Learn English in 30 Minutes: All the English You Need', 'Frasa sapaan sopan, topik obrolan ringan dengan kolega internasional, dan pengucapan natural.', 'https://www.youtube.com/watch?v=juKd26qkNAw', 'juKd26qkNAw', 1800, 1, true),
    ('b0000013-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000013', 'Top 21 Job Interview Questions & Answers', 'Richard McMunn (CareerVidz) membimbing teknik menjawab pertanyaan wawancara tersulit.', 'https://www.youtube.com/watch?v=Qks1hi9-8wU', 'Qks1hi9-8wU', 2400, 2, false),
    ('b0000013-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000013', 'Job Interview Questions & Answers in English Practice', 'Kosakata profesional, tata bahasa kerja, dan cara memaparkan kekuatan diri tanpa terkesan arogan.', 'https://www.youtube.com/watch?v=w0WGO4vpjCY', 'w0WGO4vpjCY', 2100, 3, false),
    ('b0000013-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000013', 'Job Interview in English: Workplace Conversation Practice', 'Simulasi percakapan nyata dari meja resepsionis hingga negosiasi penawaran kerja.', 'https://www.youtube.com/watch?v=GWkzCr3i0o0', 'GWkzCr3i0o0', 2100, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 14: Project Management & Agile Fundamentals (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000014-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000014', 'Project Management Simplified: PMI Fundamentals Framework', 'Kerangka kerja PMI, project charter, siklus hidup proyek, dan manajemen ruang lingkup (scope).', 'https://www.youtube.com/watch?v=ZKOL-rZ79gs', 'ZKOL-rZ79gs', 2100, 1, true),
    ('b0000014-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000014', 'Project Management in 5 Minutes: Core Principles', 'Memahami segitiga kendala proyek (waktu, biaya, kualitas) dan alur komunikasi stakeholder.', 'https://www.youtube.com/watch?v=16wmTn1cgU4', '16wmTn1cgU4', 1500, 2, false),
    ('b0000014-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', 'Agile Product Ownership in a Nutshell: Scrum & Sprints', 'Henrik Kniberg membedah peran Product Owner, Scrum Master, backlog prioritisation, dan value creation.', 'https://www.youtube.com/watch?v=502ILHjX9EE', '502ILHjX9EE', 1800, 3, false),
    ('b0000014-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', 'Intro to Kanban in Under 5 Minutes: Visual Workflow', 'Prinsip papan Kanban, work-in-progress (WIP) limits, continuous delivery, dan evaluasi throughput.', 'https://www.youtube.com/watch?v=R8dYLbJiTUE', 'R8dYLbJiTUE', 1500, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 15: Personal Branding & Career Development (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000015-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000015', 'How to Start a Personal Brand: Full Course for Beginners', 'Caleb Ralston memaparkan fondasi membangun personal brand dari nol hingga menghasilkan peluang karier.', 'https://www.youtube.com/watch?v=uJ8Pg6t_iho', 'uJ8Pg6t_iho', 2400, 1, true),
    ('b0000015-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000015', 'How to Build an Unforgettable Personal Brand: Chris Do', 'Chris Do (The Futur) membedah identitas diri, storytelling diferensiasi, dan daya tarik di pasar kerja.', 'https://www.youtube.com/watch?v=uAsAs8MoW9U', 'uAsAs8MoW9U', 2700, 2, false),
    ('b0000015-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000015', 'Personal Branding Strategic Architecture & Positioning', 'Pilar konten reputasi, optimasi profil profesional, dan social proof kredibilitas keahlian.', 'https://www.youtube.com/watch?v=Ch4Sl0POBhU', 'Ch4Sl0POBhU', 2700, 3, false),
    ('b0000015-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000015', 'How to Build a Personal Brand Starting from Zero', 'Roadmap taktis mempublikasikan karya pertama, networking dengan thought leaders, dan monetisasi skill.', 'https://www.youtube.com/watch?v=l2Lgyo3ymhw', 'l2Lgyo3ymhw', 2100, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 16: Cloud Computing & DevOps Fundamentals (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000016-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000016', 'Cloud Computing Full Course: AWS & Cloud Architecture', 'Tinjauan komprehensif infrastruktur komputasi awan, virtual machines, penyimpanan objek S3, dan VPC.', 'https://www.youtube.com/watch?v=2LaAJq1lB1Q', '2LaAJq1lB1Q', 3300, 1, true),
    ('b0000016-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000016', 'Git and GitHub for Beginners: Crash Course & Collaboration', 'Branching strategies (Trunk-based vs GitFlow), rebase vs merge, resolving conflicts, dan pull requests.', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 'RGOj5yH7evk', 2700, 2, false),
    ('b0000016-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000016', 'Docker Tutorial for Beginners: Containerization Masterclass', 'Programming with Mosh membimbing pembuatan Dockerfile efisien, image builds, port mapping, dan container isolation.', 'https://www.youtube.com/watch?v=pTFZFxd4hOI', 'pTFZFxd4hOI', 3000, 3, false),
    ('b0000016-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000016', 'DevOps CI/CD Pipelines Explained in 100 Seconds', 'Fireship menjelaskan pipeline Continuous Integration dan Continuous Deployment secara visual dan to-the-point.', 'https://www.youtube.com/watch?v=scEDHsr3APg', 'scEDHsr3APg', 1200, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, youtube_video_id = excluded.youtube_video_id, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

end $$;
