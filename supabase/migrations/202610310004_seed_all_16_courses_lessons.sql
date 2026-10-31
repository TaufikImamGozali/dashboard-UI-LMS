-- ==============================================================================
-- COURSUE LMS: SEED COMPLETE LESSONS & PRO PRICES FOR ALL 16 COURSES
-- Migration: 202610310004_seed_all_16_courses_lessons.sql
-- Description: Sets Pro course prices and inserts rich curriculum lessons for courses 1-16
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

  -- 2. SEED LESSONS FOR ALL 16 COURSES
  -- Course 01: Artificial Intelligence (AI) untuk Pemula
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000001-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Pengenalan Kecerdasan Buatan & ChatGPT', 'Memahami konsep dasar AI, Generative AI, dan Large Language Models.', 'https://www.youtube.com/watch?v=2eWuYf-aZE4', '2eWuYf-aZE4', 1800, 1, true),
    ('b0000001-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Seni Prompt Engineering untuk Produktivitas', 'Teknik menyusun prompt terstruktur: role, context, constraints, few-shot prompts.', 'https://www.youtube.com/watch?v=jC4v5AS4RIM', 'jC4v5AS4RIM', 2400, 2, false),
    ('b0000001-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Pemanfaatan AI Tools dalam Alur Kerja Harian', 'Integrasi AI untuk riset, penulisan konten, ringkasan dokumen, dan otomatisasi tugas.', 'https://www.youtube.com/watch?v=b-hZ_b0e_48', 'b-hZ_b0e_48', 2100, 3, false),
    ('b0000001-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Membangun Asisten AI Kustom & Integrasi API', 'Cara membuat Custom GPTs dan menghubungkan API AI dengan workflow kerja.', 'https://www.youtube.com/watch?v=jtAm_q95m44', 'jtAm_q95m44', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 02: Full Stack Web Development dari Nol
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000002-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'HTML5 Semantik & Dasar Arsitektur Web', 'Belajar struktur dokumen HTML5, tag semantik, form validation, dan SEO dasar.', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 'kUMe1FH4CHE', 3600, 1, true),
    ('b0000002-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'CSS Flexbox, Grid & Responsive Design', 'Menguasai layout modern yang ramah perangkat mobile, tablet, dan desktop.', 'https://www.youtube.com/watch?v=yfoY53QXEnI', 'yfoY53QXEnI', 4200, 2, false),
    ('b0000002-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'JavaScript Modern ES6+ & DOM Manipulation', 'Variabel modern, arrow functions, promises, fetch API, dan manipulasi DOM dinamis.', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 'W6NZfCO5SIk', 5100, 3, false),
    ('b0000002-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'React & State Management untuk Pemula', 'Komponen, Props, useState, useEffect, dan interaktivitas aplikasi web modern.', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 'SqcY0GlETPk', 3600, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 03: UI/UX Design: Dari Ide hingga Prototype
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000003-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Dasar Design Thinking & User Research', 'Memahami empati pengguna, persona, pain points, dan perumusan masalah UX.', 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', 'c9Wg6Cb_YlU', 1800, 1, true),
    ('b0000003-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', 'Wireframing & Desain Komponen di Figma', 'Auto layout, constraints, styles, dan token warna sistematis di Figma.', 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', 'FTFaQWZBqQ8', 3600, 2, false),
    ('b0000003-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Design System Architecture & Auto-Layout', 'Membangun library komponen UI yang konsisten dan mudah di-maintain.', 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', 'w7ejDZ8SWv8', 3000, 3, false),
    ('b0000003-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 'Interactive Prototyping & Usability Testing', 'Menghubungkan screen, transisi mikro animasi, dan pengujian langsung ke pengguna.', 'https://www.youtube.com/watch?v=eT7f3Yy2Fh4', 'eT7f3Yy2Fh4', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 04: Digital Marketing & Social Media Strategy
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000004-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Pengenalan Digital Marketing & Funnel Pemasaran', 'Dasar digital marketing: awareness, consideration, conversion, dan retention funnel.', 'https://www.youtube.com/watch?v=bixR-KIJKYM', 'bixR-KIJKYM', 2400, 1, true),
    ('b0000004-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000004', 'Dasar SEO & Content Marketing Organik', 'Keyword research, on-page SEO, backlink, dan pembuatan konten bernilai tinggi.', 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', 'DvwS7cV9GmQ', 3000, 2, false),
    ('b0000004-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000004', 'Iklan Berbayar: Meta Ads & Google Search Ads', 'Menyusun campaign, targeting audiens presisi, dan kalkulasi ROI/ROAS iklan.', 'https://www.youtube.com/watch?v=1bPEq4i_XfQ', '1bPEq4i_XfQ', 3300, 3, false),
    ('b0000004-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'Email Marketing Automation & Retargeting', 'Membangun email list pelanggan dan alur automasi retargeting loyalitas.', 'https://www.youtube.com/watch?v=mdf_7j5F3d0', 'mdf_7j5F3d0', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 05: Graphic Design & Visual Branding (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000005-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Prinsip Desain Grafis & Komposisi Visual', 'Hirarki visual, balance, contrast, alignment, dan whitespace dalam desain visual.', 'https://www.youtube.com/watch?v=YqQx75OPWA0', 'YqQx75OPWA0', 2100, 1, true),
    ('b0000005-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 'Tipografi & Teori Warna untuk Identitas Brand', 'Pemilihan font pairing yang harmonis, psikologi warna, dan pembuatan palette brand.', 'https://www.youtube.com/watch?v=sByzHoiYFX0', 'sByzHoiYFX0', 2700, 2, false),
    ('b0000005-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000005', 'Merancang Logo Vektor & Brand Guideline', 'Teknik sketsa ide logo hingga eksekusi vektor di Illustrator dan penyusunan brand book.', 'https://www.youtube.com/watch?v=Z3k3bC-B5gM', 'Z3k3bC-B5gM', 3000, 3, false),
    ('b0000005-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000005', 'Packaging Design & Real-World Product Mockup', 'Penerapan identitas merek pada packaging nyata, kartu nama, dan mockups 3D.', 'https://www.youtube.com/watch?v=x802wI-c9fE', 'x802wI-c9fE', 2400, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 06: Data Analytics untuk Pemula (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000006-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Pengantar Analisis Data & Excel Spreadsheet', 'Data cleaning, formula penting (XLOOKUP, INDEX/MATCH), dan analisis Pivot Table.', 'https://www.youtube.com/watch?v=ox7XFm-05VU', 'ox7XFm-05VU', 2700, 1, true),
    ('b0000006-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000006', 'SQL Dasar hingga Lanjutan untuk Query Database', 'SELECT, WHERE, GROUP BY, INNER/LEFT JOIN, dan agregasi data dari database relasional.', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', '7S_tz1z_5bA', 3300, 2, false),
    ('b0000006-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000006', 'Visualisasi Data Interaktif dengan Power BI', 'Membuat dashboard analitik bisnis, kartu KPI penjualan, dan visual filter interaktif.', 'https://www.youtube.com/watch?v=AGrl-H87pRU', 'AGrl-H87pRU', 3600, 3, false),
    ('b0000006-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000006', 'Python untuk Data Analysis dengan Pandas', 'Eksplorasi dataset menggunakan pustaka Pandas, NumPy, dan visualisasi Matplotlib.', 'https://www.youtube.com/watch?v=GPVsHOlRBBI', 'GPVsHOlRBBI', 3000, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 07: Cybersecurity & Keamanan Digital
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000007-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000007', 'Anatomi Ancaman Siber & Kesadaran Keamanan', 'Tinjauan lanskap ancaman modern, teknik phishing, manipulasi psikologis, dan proteksi akun.', 'https://www.youtube.com/watch?v=inWWhr5tnEA', 'inWWhr5tnEA', 2400, 1, true),
    ('b0000007-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000007', 'Keamanan Jaringan & Protokol Komunikasi Aman', 'Model OSI, firewall, VPN, enkripsi simetris/asimetris, dan sertifikat SSL/TLS.', 'https://www.youtube.com/watch?v=z5nc9MDbvkw', 'z5nc9MDbvkw', 3000, 2, false),
    ('b0000007-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000007', 'Kerentanan Aplikasi Web & OWASP Top 10', 'Menganalisis serangan web paling umum dan mekanisme mitigasi kode yang aman.', 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', '3Kq1MIfTWCE', 3300, 3, false),
    ('b0000007-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000007', 'Strategi Respons Insiden & Defensive Security', 'Langkah taktis penanganan kebocoran data, audit log sistem, dan disaster recovery.', 'https://www.youtube.com/watch?v=hXSFdwIOfnE', 'hXSFdwIOfnE', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 08: Video Editing & Content Creation (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000008-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000008', 'Storytelling Visual & Hook 3 Detik Pertama', 'Memahami psikologi penonton media sosial, pemilihan angle kamera, dan struktur alur narasi.', 'https://www.youtube.com/watch?v=q8s_lK248_w', 'q8s_lK248_w', 2100, 1, true),
    ('b0000008-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000008', 'Workflow Editing Cepat di CapCut & Premiere Pro', 'Shortcut penting, ripple delete, keyframing zoom dinamis, dan masking objek.', 'https://www.youtube.com/watch?v=4Ww2_q1c5Hk', '4Ww2_q1c5Hk', 3300, 2, false),
    ('b0000008-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000008', 'Sound Design & Color Grading Sinematik', 'Teknik audio ducking, sound effects penegas emosi, dan grading palet warna film.', 'https://www.youtube.com/watch?v=m0s40wZ5wLE', 'm0s40wZ5wLE', 3000, 3, false),
    ('b0000008-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000008', 'Strategi Optimasi Video Viral di TikTok & Reels', 'Pemilihan rasio aspek, caption engaging, sound trending, dan konsistensi posting.', 'https://www.youtube.com/watch?v=k443rP4T_s0', 'k443rP4T_s0', 2400, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 09: Public Speaking & Komunikasi Profesional
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000009-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000009', 'Fondasi Kepercayaan Diri & Mengatasi Demam Panggung', 'Teknik pernapasan diafragma, mindset percaya diri, dan persiapan psikologis sebelum tampil.', 'https://www.youtube.com/watch?v=tShavGuo0_E', 'tShavGuo0_E', 2100, 1, true),
    ('b0000009-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000009', 'Bahasa Tubuh, Kontak Mata & Artikulasi Vokal', 'Postur panggung yang mantap, gesture tangan yang natural, dan variasi intonasi suara.', 'https://www.youtube.com/watch?v=unRydz4u7v8', 'unRydz4u7v8', 2700, 2, false),
    ('b0000009-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000009', 'Menyusun Struktur Presentasi Berdampak Tinggi', 'Teknik membuka materi dengan hook kuat, elaborasi poin kunci, dan call-to-action berkesan.', 'https://www.youtube.com/watch?v=Xk1bL0s_17M', 'Xk1bL0s_17M', 2400, 3, false),
    ('b0000009-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000009', 'Menangani Sesi Tanya Jawab & Audiens Kritis', 'Strategi menjawab pertanyaan menjebak, mengakui batasan informasi, dan negosiasi persuasif.', 'https://www.youtube.com/watch?v=gZ3z2nK8HLE', 'gZ3z2nK8HLE', 2100, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 10: Financial Literacy & Personal Finance
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000010-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000010', 'Manajemen Cash Flow & Anggaran Finansial 50/30/20', 'Membedah pos kebutuhan pokok, keinginan, dan tabungan investasi dengan metode sistematis.', 'https://www.youtube.com/watch?v=WEDIj9JBTC8', 'WEDIj9JBTC8', 2100, 1, true),
    ('b0000010-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000010', 'Fondasi Dana Darurat & Manajemen Hutang Sehat', 'Kalkulasi kebutuhan dana darurat sesuai status pernikahan dan strategi snowball pelunasan hutang.', 'https://www.youtube.com/watch?v=sK7_c3K65m0', 'sK7_c3K65m0', 2400, 2, false),
    ('b0000010-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', 'Mengenal Ragam Instrumen Investasi Rendah Risiko', 'Perbandingan deposito, Surat Berharga Negara (SBN), dan reksadana pasar uang.', 'https://www.youtube.com/watch?v=r17BwJ33E2g', 'r17BwJ33E2g', 2700, 3, false),
    ('b0000010-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000010', 'Investasi Saham & Perencanaan Pensiun Mandiri', 'Menganalisis kinerja perusahaan fundamental, dividen, dan prinsip compound interest jangka panjang.', 'https://www.youtube.com/watch?v=y1vR8gL8K00', 'y1vR8gL8K00', 3000, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 11: Digital Entrepreneurship: Membangun Bisnis Online (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000011-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000011', 'Riset Pasar, Validasi Ide & Menemukan Niche Bisnis', 'Metode membedah tren pasar, riset kompetitor, dan memvalidasi kebutuhan konsumen nyata.', 'https://www.youtube.com/watch?v=dGg_7sV69kM', 'dGg_7sV69kM', 2700, 1, true),
    ('b0000011-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000011', 'Merancang Value Proposition & Business Model Canvas', 'Menyusun formula penawaran produk yang sulit ditolak dan memetakan struktur biaya bisnis.', 'https://www.youtube.com/watch?v=7G1JqK0_r1c', '7G1JqK0_r1c', 3000, 2, false),
    ('b0000011-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000011', 'Setup Toko Online, Katalog & Integrasi Payment', 'Membangun landing page penjualan, integrasi pembayaran digital, dan notifikasi WhatsApp otomatis.', 'https://www.youtube.com/watch?v=f9K10s7V0xU', 'f9K10s7V0xU', 3600, 3, false),
    ('b0000011-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000011', 'Strategi Scale-Up Omset & Customer Retention', 'Meningkatkan lifetime value pelanggan, program referral, dan pendelegasian operasional bisnis.', 'https://www.youtube.com/watch?v=17m_k8wR6lE', '17m_k8wR6lE', 3300, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 12: AI Automation & No-Code Development (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000012-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000012', 'Pengantar Ekosistem No-Code & AI Automation', 'Prinsip kerja trigger, action, webhook, dan arsitektur otomasi bisnis masa kini.', 'https://www.youtube.com/watch?v=m1gGgE1v-w8', 'm1gGgE1v-w8', 2400, 1, true),
    ('b0000012-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000012', 'Membangun Workflow Otomasi Cerdas di Make.com', 'Menghubungkan email, Google Sheets, WhatsApp, dan memproses data secara otomatis.', 'https://www.youtube.com/watch?v=Z19p7K3o8lM', 'Z19p7K3o8lM', 3300, 2, false),
    ('b0000012-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000012', 'Airtable Relational Database & Webflow App', 'Membuat sistem CRM interaktif dan katalog dinamis tanpa perlu server backend.', 'https://www.youtube.com/watch?v=X5q1rP9t9v0', 'X5q1rP9t9v0', 3900, 3, false),
    ('b0000012-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000012', 'Mendeploy AI Chatbot Khusus Berbasis Dokumen Perusahaan', 'Menyematkan bot AI yang mampu membaca FAQ dan katalog produk untuk melayani pelanggan.', 'https://www.youtube.com/watch?v=2w1xY0z7K0M', '2w1xY0z7K0M', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 13: English for Career & Daily Conversation
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000013-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000013', 'Daily Workplace Small Talk & Ice Breaking', 'Frasa sapaan sopan, topik obrolan ringan dengan kolega internasional, dan pengucapan natural.', 'https://www.youtube.com/watch?v=juKd26qkNAw', 'juKd26qkNAw', 2100, 1, true),
    ('b0000013-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000013', 'Mastering English Job Interviews & STAR Method', 'Cara menjawab "Tell me about yourself" dan pertanyaan berbasis situasi dengan terstruktur.', 'https://www.youtube.com/watch?v=wK0K9v8Z8nM', 'wK0K9v8Z8nM', 3000, 2, false),
    ('b0000013-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000013', 'Writing Effective & Polite Business Emails', 'Format email resmi, ungkapan sopan meminta bantuan, dan penanganan komplain klien.', 'https://www.youtube.com/watch?v=y5l_wX9mK80', 'y5l_wX9mK80', 2400, 3, false),
    ('b0000013-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000013', 'Leading Virtual Meetings & Disagreeing Diplomatically', 'Mengatur alur meeting, menyela pembicaraan secara sopan, dan merangkum keputusan rapat.', 'https://www.youtube.com/watch?v=17q_gH6kL5M', '17q_gH6kL5M', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 14: Project Management & Agile Fundamentals (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000014-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000014', 'Fondasi Project Management & Siklus Hidup Proyek', 'Definisi proyek, project charter, work breakdown structure (WBS), dan manajemen ruang lingkup.', 'https://www.youtube.com/watch?v=502ILHjX9EE', '502ILHjX9EE', 2400, 1, true),
    ('b0000014-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', 'Agile Mindset & Scrum Framework Lengkap', 'Peran Product Owner, Scrum Master, Developers, serta tata cara upacara sprint berulang.', 'https://www.youtube.com/watch?v=9TycLR0TqFA', '9TycLR0TqFA', 3300, 2, false),
    ('b0000014-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', 'Praktik Papan Kanban & Pengelolaan Backlog di Jira', 'Story point estimation, burn-down charts, pengelolaan issue, dan alur tiket kerja.', 'https://www.youtube.com/watch?v=hA0t7K6X0sM', 'hA0t7K6X0sM', 3000, 3, false),
    ('b0000014-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', 'Mitigasi Risiko Proyek & Laporan Status Stakeholder', 'Matriks risiko probabilitas-dampak dan teknik komunikasi laporan eksekutif.', 'https://www.youtube.com/watch?v=3xL9v6nB1rU', '3xL9v6nB1rU', 2700, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 15: Personal Branding & Career Development (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000015-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000015', 'Membangun Unique Value Proposition & Brand Diri', 'Memetakan keahlian inti, pencapaian unik, dan identitas profesional yang membedakan Anda di industri.', 'https://www.youtube.com/watch?v=k543K81eP7E', 'k543K81eP7E', 2100, 1, true),
    ('b0000015-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000015', 'Optimasi LinkedIn Magnet Rekruter & Strategi Konten', 'Headline memikat, bagian About persuasif, social proof rekomendasi, dan networking organik.', 'https://www.youtube.com/watch?v=aK17gP0y7vM', 'aK17gP0y7vM', 3000, 2, false),
    ('b0000015-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000015', 'Membuat CV Lolos ATS & Portofolio Menjual', 'Format CV yang terbaca mesin penyaring, kuantifikasi prestasi dengan metrik, dan link portofolio.', 'https://www.youtube.com/watch?v=8xH7wK6t5n0', '8xH7wK6t5n0', 2700, 3, false),
    ('b0000015-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000015', 'Seni Negosiasi Gaji & Strategi Transisi Karier', 'Riset standar gaji industri, etika bernegosiasi saat offer letter tiba, dan perpindahan jalur karier.', 'https://www.youtube.com/watch?v=z1g6k0sV7pE', 'z1g6k0sV7pE', 2400, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

  -- Course 16: Cloud Computing & DevOps Fundamentals (PRO)
  insert into public.lessons (id, course_id, title, description, youtube_url, youtube_video_id, duration_seconds, position, is_preview)
  values
    ('b0000016-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000016', 'Pengantar Cloud Computing & Arsitektur AWS/GCP', 'Tinjauan infrastruktur komputasi awan, virtual machines, penyimpanan objek S3, dan model shared responsibility.', 'https://www.youtube.com/watch?v=2LaAJq1lB1Q', '2LaAJq1lB1Q', 2700, 1, true),
    ('b0000016-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000016', 'Git & GitHub Collaboration Workflow Tingkat Lanjut', 'Branching strategies (Trunk-based vs GitFlow), rebase vs merge, resolving conflicts, dan PR review.', 'https://www.youtube.com/watch?v=RGOj5yH7evk', 'RGOj5yH7evk', 3000, 2, false),
    ('b0000016-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000016', 'Containerization dengan Docker & Docker Compose', 'Membuat Dockerfile efisien, multi-stage builds, port mapping, dan orkestrasi multi-container.', 'https://www.youtube.com/watch?v=fqMOX6JJ8KE', 'fqMOX6JJ8KE', 3900, 3, false),
    ('b0000016-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000016', 'Otomatisasi CI/CD Pipelines & Cloud Deployment', 'GitHub Actions workflow, automated testing, linting, dan trigger auto-deployment ke hosting awan.', 'https://www.youtube.com/watch?v=scEDHsr3APg', 'scEDHsr3APg', 3300, 4, false)
  on conflict (id) do update set title = excluded.title, youtube_url = excluded.youtube_url, duration_seconds = excluded.duration_seconds, is_preview = excluded.is_preview;

end $$;

