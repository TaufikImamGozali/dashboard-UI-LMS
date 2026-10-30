// Centralized copy and data for Coursue Landing Page
// All text, statistics, FAQs, testimonials, and features are managed here.

export interface LandingStat {
  id: string;
  value: string;
  label: string;
  description: string;
  iconName: 'Users' | 'Award' | 'BookOpen' | 'Star';
}

export interface LandingFeature {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconName: 'BookCheck' | 'MessageSquareQuote' | 'PlayCircle' | 'TrendingUp' | 'ShieldCheck' | 'Sparkles';
  accentColor: string;
}

export interface LandingStep {
  step: string;
  title: string;
  description: string;
  tip: string;
}

export interface LandingTestimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  course: string;
  // TODO: Data testimoni berikut adalah data contoh representatif sampai survei testimoni siswa riil terkumpul
  isSample: boolean;
}

export interface LandingFaq {
  id: string;
  question: string;
  answer: string;
}

export interface LandingNavAnchor {
  label: string;
  href: string;
}

export const landingContent = {
  meta: {
    title: 'Coursue - Platform Belajar Coding, UI/UX, & Teknologi Terdepan',
    description:
      'Tingkatkan keterampilan digital Anda dengan kursus terarah berbasis proyek nyata. Dipandu mentor industri, interaktif, dan fleksibel untuk masa depan karier Anda.',
    ogTitle: 'Coursue - Belajar Keterampilan Digital Terkini',
    ogDescription:
      'Pelajari Frontend Development, UI/UX Design, dan Branding dengan kurikulum terstruktur dan bimbingan mentor profesional.',
    siteUrl: 'https://coursue.com',
  },

  nav: {
    brandName: 'Coursue',
    tagline: 'Online Learning Platform',
    anchors: [
      { label: 'Fitur', href: '#fitur' },
      { label: 'Kelas Pilihan', href: '#kelas' },
      { label: 'Cara Kerja', href: '#cara-kerja' },
      { label: 'Testimoni', href: '#testimoni' },
      { label: 'FAQ', href: '#faq' },
    ] as LandingNavAnchor[],
    ctaLogin: 'Masuk',
    ctaRegister: 'Daftar Gratis',
    ctaDashboard: 'Ke Dashboard',
  },

  hero: {
    badge: '🚀 Platform Belajar Generasi Baru',
    headline: 'Tingkatkan Keahlian Digital dengan Pembelajaran Berbasis Proyek',
    headlineHighlight: 'Karier Impian',
    subheadline:
      'Kuasai Frontend Development, UI/UX Design, dan Arsitektur Digital melalui silabus praktis, modul video interaktif, dan pendampingan mentor industri.',
    ctaPrimary: 'Mulai Belajar Gratis',
    ctaSecondary: 'Lihat Katalog Kelas',
    ctaDashboard: 'Buka Dashboard Anda',
    trustNote: '✨ 100% Gratis untuk kelas dasar • Tanpa kartu kredit • Akses seumur hidup',
    metricsCard: {
      title: 'Tingkat Kepuasan Siswa',
      rating: '4.9 / 5.0',
      totalReviews: 'dari 3.400+ ulasan',
    },
    activeStudentsCard: {
      count: '1.200+',
      label: 'Siswa aktif belajar minggu ini',
    },
  },

  stats: [
    {
      id: 'students',
      value: '1.200+',
      label: 'Siswa Terdaftar',
      description: 'Aktif belajar di berbagai kelompok peminatan',
      iconName: 'Users',
    },
    {
      id: 'mentors',
      value: '50+',
      label: 'Mentor Industri',
      description: 'Praktisi dari top tech company & design studio',
      iconName: 'Award',
    },
    {
      id: 'courses',
      value: '200+',
      label: 'Modul & Video Praktik',
      description: 'Materi terstruktur dari dasar hingga tingkat lanjut',
      iconName: 'BookOpen',
    },
    {
      id: 'satisfaction',
      value: '98%',
      label: 'Tingkat Kepuasan',
      description: 'Siswa merasa skill berkembang secara signifikan',
      iconName: 'Star',
    },
  ] as LandingStat[],

  features: {
    badge: 'Keunggulan Coursue',
    title: 'Didesain Khusus untuk Efektivitas Belajar Anda',
    subtitle:
      'Kami mengombinasikan silabus terstruktur, interaksi komunitas, dan pengawasan progres agar proses belajar menjadi konsisten dan menyenangkan.',
    items: [
      {
        id: 'curriculum',
        title: 'Kurikulum Berbasis Proyek Nyata',
        description:
          'Bukan sekadar hafalan teori. Setiap modul menugaskan Anda membangun komponen nyata untuk portofolio siap kerja.',
        badge: 'Praktis & Teruji',
        iconName: 'BookCheck',
        accentColor: 'brand',
      },
      {
        id: 'discussion',
        title: 'Peer Discussion & Grup Belajar',
        description:
          'Terhubung langsung dengan teman sekelas dan mentor untuk berdiskusi, review kode, serta membedah studi kasus desain.',
        badge: 'Komunitas Aktif',
        iconName: 'MessageSquareQuote',
        accentColor: 'indigo',
      },
      {
        id: 'interactive-video',
        title: 'Video Pembelajaran Ringkas & Padat',
        description:
          'Materi video terintegrasi dengan penanda bab dan durasi efisien sehingga mudah dipahami tanpa bertele-tele.',
        badge: 'Format Modern',
        iconName: 'PlayCircle',
        accentColor: 'emerald',
      },
      {
        id: 'progress-tracker',
        title: 'Visual Progress & Task Tracker',
        description:
          'Pantau persentase penyelesaian kursus, target mingguan, dan tugas mandiri Anda melalui dashboard analitik real-time.',
        badge: 'Dashboard Pintar',
        iconName: 'TrendingUp',
        accentColor: 'rose',
      },
      {
        id: 'mentorship',
        title: 'Bimbingan Mentor Berpengalaman',
        description:
          'Dapatkan wawasan standar industri, tips wawancara teknis, dan arahan terbaik dari praktisi senior yang relevan.',
        badge: 'Kualitas Terjamin',
        iconName: 'ShieldCheck',
        accentColor: 'amber',
      },
      {
        id: 'flexibility',
        title: 'Akses Fleksibel Kapan Saja',
        description:
          'Belajar sesuai ritme dan kesibukan Anda sendiri melalui perangkat laptop, tablet, maupun smartphone dengan lancar.',
        badge: 'Self-Paced',
        iconName: 'Sparkles',
        accentColor: 'sky',
      },
    ] as LandingFeature[],
  },

  courses: {
    badge: 'Katalog Unggulan',
    title: 'Jelajahi Kelas Terpopuler',
    subtitle:
      'Mulai dari materi dasar hingga teknik spesialisasi lanjutan yang paling banyak dicari di industri saat ini.',
    filterAll: 'Semua Kategori',
    ctaExplore: 'Lihat Semua Kelas di Dashboard',
    priceFree: 'GRATIS',
    // Fallback data when Supabase courses table is empty or offline
    // TODO: Fallback ini digunakan sementara jika tabel kursus di Supabase belum ada data published
    fallbackCourses: [
      {
        id: 'demo-c1',
        title: 'Modern UI/UX Design System with Figma',
        category: 'design',
        categoryLabel: 'UI/UX DESIGN',
        thumbnail:
          'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
        progress: 0,
        price: 0,
        level: 'Beginner',
        rating: 4.9,
        reviewsCount: 312,
        totalDuration: '4h 15m',
        mentor: {
          name: 'Sarah Jenkins',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
          role: 'Lead Product Designer',
        },
        isFavorite: false,
      },
      {
        id: 'demo-c2',
        title: 'Fullstack React 19 & Supabase Masterclass',
        category: 'frontend',
        categoryLabel: 'FRONT END',
        thumbnail:
          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
        progress: 0,
        price: 149000,
        level: 'Intermediate',
        rating: 4.85,
        reviewsCount: 245,
        totalDuration: '6h 40m',
        mentor: {
          name: 'David Wilson',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          role: 'Senior Fullstack Engineer',
        },
        isFavorite: false,
      },
      {
        id: 'demo-c3',
        title: 'Brand Identity & Visual Storytelling for Tech',
        category: 'branding',
        categoryLabel: 'BRANDING',
        thumbnail:
          'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80',
        progress: 0,
        price: 0,
        level: 'All',
        rating: 4.92,
        reviewsCount: 188,
        totalDuration: '3h 50m',
        mentor: {
          name: 'Elena Rostova',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          role: 'Creative Director',
        },
        isFavorite: false,
      },
    ],
  },

  howItWorks: {
    badge: 'Alur Mudah',
    title: '3 Langkah Memulai Perjalanan Belajar Anda',
    subtitle: 'Tidak ada langkah yang rumit. Anda bisa mulai belajar materi pertama dalam hitungan menit.',
    steps: [
      {
        step: '01',
        title: 'Buat Akun Gratis',
        description:
          'Daftar dalam waktu kurang dari 1 menit. Langsung dapatkan akses instan ke dasbor siswa dan materi pembuka.',
        tip: 'Gratis tanpa butuh kartu kredit',
      },
      {
        step: '02',
        title: 'Pilih Kelas Peminatan',
        description:
          'Temukan silabus yang cocok dengan target karier Anda, baik itu Frontend, UI/UX, maupun Branding.',
        tip: 'Tersedia kelas gratis & berbayar',
      },
      {
        step: '03',
        title: 'Belajar & Bangun Portofolio',
        description:
          'Tonton materi video interaktif, selesaikan latihan praktik bertahap, dan kumpulkan karya portofolio Anda.',
        tip: 'Didukung grup tanya jawab mentor',
      },
    ] as LandingStep[],
  },

  testimonials: {
    badge: 'Kisah Sukses Siswa',
    title: 'Apa Kata Mereka yang Sudah Belajar di Coursue',
    subtitle:
      'Ratusan siswa telah mempercepat pemahaman teknologi dan mendapatkan karier yang lebih baik.',
    // TODO: Testimoni di bawah ini adalah data contoh representatif sampai integrasi form ulasan siswa di Supabase dirilis
    items: [
      {
        id: 'testi-1',
        name: 'Rian Pratama',
        role: 'Junior Frontend Developer di FinTech',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        comment:
          'Silabus React & TypeScript di Coursue sangat rapi. Penjelasannya langsung ke contoh kasus industri nyata dan membuat saya percaya diri lolos technical interview!',
        course: 'Fullstack React & Supabase Masterclass',
        isSample: true,
      },
      {
        id: 'testi-2',
        name: 'Anindya Putri',
        role: 'UI Designer di Digital Agency',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        comment:
          'Dashboard Coursue sangat memotivasi karena progress belajarnya jelas. Fitur grup diskusi juga sangat membantu saat bingung memahami auto-layout Figma.',
        course: 'Modern UI/UX Design System with Figma',
        isSample: true,
      },
      {
        id: 'testi-3',
        name: 'Budi Santoso',
        role: 'Career Switcher ke Tech',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        comment:
          'Sebagai orang non-IT, belajar coding awalnya terasa intimidatif. Di Coursue materinya dipecah menjadi modul kecil 10 menitan yang sangat mudah dicerna setelah pulang kerja.',
        course: 'Web Development Fundamental',
        isSample: true,
      },
    ] as LandingTestimonial[],
  },

  faq: {
    badge: 'Tanya Jawab',
    title: 'Pertanyaan yang Sering Diajukan',
    subtitle:
      'Punya pertanyaan seputar cara belajar, materi, atau akun? Berikut rangkuman jawaban yang paling sering ditanyakan.',
    items: [
      {
        id: 'faq-1',
        question: 'Apakah kelas di Coursue benar-benar gratis?',
        answer:
          'Ya! Coursue menyediakan banyak kelas dasar dan materi fundamental yang dapat diakses secara 100% gratis. Untuk materi spesialisasi tingkat lanjut yang mendalam, tersedia kelas berbayar dengan harga yang sangat terjangkau.',
      },
      {
        id: 'faq-2',
        question: 'Bagaimana metode belajarnya, apakah ada jadwal tertentu?',
        answer:
          'Pembelajaran di Coursue berbasis online mandiri (self-paced). Anda dapat mengakses video dan materi kapan saja 24/7 sesuai dengan ritme waktu luang Anda, tanpa khawatir ketinggalan kelas tatap muka.',
      },
      {
        id: 'faq-3',
        question: 'Apakah pemula tanpa latar belakang coding/desain bisa bergabung?',
        answer:
          'Tentu saja bisa. Setiap kursus memiliki penanda tingkat kesulitan (Beginner, Intermediate, Advanced). Silabus level Beginner dirancang dari konsep paling mendasar dengan contoh yang mudah dipahami pemula.',
      },
      {
        id: 'faq-4',
        question: 'Bagaimana jika saya mengalami kendala atau bingung saat mempraktikkan materi?',
        answer:
          'Setiap siswa dapat memanfaatkan fitur Peer Discussion dan Group Chat di dalam platform untuk berdiskusi dengan mentor dan sesama rekan pembelajar.',
      },
      {
        id: 'faq-5',
        question: 'Apakah saya bisa mengakses Coursue lewat smartphone atau tablet?',
        answer:
          'Ya, seluruh antarmuka web Coursue dirancang responsif sehingga berjalan mulus di layar smartphone, tablet, maupun layar desktop/laptop.',
      },
      {
        id: 'faq-6',
        question: 'Bagaimana cara mendaftar dan mulai belajar?',
        answer:
          'Cukup klik tombol "Daftar Gratis", isi nama lengkap dan email Anda. Akun Anda akan langsung aktif dan Anda bisa segera memilih kelas pertama di dashboard.',
      },
    ] as LandingFaq[],
  },

  cta: {
    badge: 'Mulai Hari Ini',
    title: 'Siap Mengembangkan Keterampilan Digital Anda?',
    subtitle:
      'Bergabunglah bersama ribuan pembelajar lainnya. Buka potensi terbaik Anda dan bangun portofolio karier impian sekarang.',
    buttonText: 'Daftar Sekarang - Gratis',
    secondaryButton: 'Masuk ke Akun Saya',
    guarantee: 'Tanpa biaya pendaftaran • Akses kelas dasar gratis seumur hidup',
  },

  footer: {
    about:
      'Coursue adalah platform pembelajaran online modern yang membantu talenta digital menguasai teknologi, desain, dan strategi produk melalui silabus terarah berbasis proyek.',
    links: {
      platform: [
        { label: 'Fitur Utama', href: '#fitur' },
        { label: 'Katalog Kelas', href: '#kelas' },
        { label: 'Cara Belajar', href: '#cara-kerja' },
        { label: 'Pertanyaan (FAQ)', href: '#faq' },
      ],
      categories: [
        { label: 'Frontend Development', href: '#kelas' },
        { label: 'UI/UX Design', href: '#kelas' },
        { label: 'Brand & Visual Identity', href: '#kelas' },
        { label: 'Arsitektur Perangkat Lunak', href: '#kelas' },
      ],
      legal: [
        { label: 'Ketentuan Layanan', href: '/terms' },
        { label: 'Kebijakan Privasi', href: '/privacy' },
        { label: 'Pusat Bantuan', href: '/help' },
      ],
    },
    copyright: `© ${new Date().getFullYear()} Coursue Inc. Seluruh hak cipta dilindungi.`,
  },
};

