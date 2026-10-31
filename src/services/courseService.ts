import { supabase } from '../lib/supabase';
import { mockCourses } from '../data/mockData';
import { mockCoursesDetail } from '../data/courses';
import type {
  CategoryType,
  Course,
  CourseDetail,
  CurriculumLesson,
  CourseSection,
  CourseLevel,
  Lesson,
  ProgressSummary,
} from '../types';
import type { DbCourse, DbLesson, UserCourseProgress } from '../types/database';

export interface ExploreCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  category: CategoryType;
  categoryLabel: string;
  level: CourseLevel;
  price: number;
  lessonsCount: number;
  isEnrolled: boolean;
  mentor: {
    name: string;
    avatar: string;
    role: string;
  };
}

export const formatDurationFromSeconds = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins.toString().padStart(2, '0')}m`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getCategoryLabel = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'frontend':
      return 'FRONT END';
    case 'design':
      return 'UI/UX DESIGN';
    case 'branding':
      return 'BRANDING';
    case 'ai':
      return 'ARTIFICIAL INTELLIGENCE';
    case 'marketing':
      return 'DIGITAL MARKETING';
    case 'data':
      return 'DATA ANALYTICS';
    case 'security':
      return 'CYBERSECURITY';
    case 'creative':
      return 'CONTENT CREATION';
    case 'softskills':
      return 'CAREER & SKILLS';
    case 'finance':
      return 'FINANCIAL LITERACY';
    case 'business':
      return 'ENTREPRENEURSHIP';
    case 'devops':
      return 'CLOUD & DEVOPS';
    case 'mobile':
      return 'MOBILE DEV';
    default:
      return category.toUpperCase();
  }
};

export const normalizeLevel = (level: string): CourseLevel => {
  const l = level.toLowerCase();
  if (l.includes('beginner')) return 'Beginner';
  if (l.includes('intermediate')) return 'Intermediate';
  if (l.includes('advanced')) return 'Advanced';
  return 'Beginner';
};

export const courseService = {
  // 1. Get all published courses for catalog / explorer
  getPublishedCourses: async (): Promise<Course[]> => {
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          description,
          thumbnail_url,
          category,
          level,
          price,
          status,
          created_at,
          updated_at,
          mentor_id,
          profiles:mentor_id (
            id,
            name,
            avatar,
            role
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error || !courses || courses.length === 0) {
        if (error) {
          console.warn('Notice fetching published courses from Supabase (using mock fallback):', error.message);
        }
        return mockCourses;
      }

      // Check if user is logged in to merge their progress
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      let progressMap: Record<string, UserCourseProgress> = {};
      if (userId) {
        const { data: progressList } = await supabase
          .from('user_course_progress')
          .select('*')
          .eq('user_id', userId);

        if (progressList) {
          progressMap = progressList.reduce<Record<string, UserCourseProgress>>((acc, item) => {
            acc[item.course_id] = item;
            return acc;
          }, {});
        }
      }

      return (courses as unknown as (DbCourse & { profiles?: { name?: string; avatar?: string; role?: string } | null })[]).map((c) => {
        const userProgress = progressMap[c.id];
        return {
          id: c.id,
          title: c.title,
          category: c.category as CategoryType,
          categoryLabel: getCategoryLabel(c.category),
          thumbnail:
            c.thumbnail_url ||
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
          progress: userProgress ? Number(userProgress.progress_percentage) : 0,
          mentor: {
            name: c.profiles?.name || 'Coursue Mentor',
            avatar:
              c.profiles?.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            role: c.profiles?.role === 'admin' ? 'Platform Administrator' : 'Lead Instructor',
          },
          isFavorite: false,
          level: normalizeLevel(c.level),
          rating: 4.9,
          reviewsCount: 128,
          studentsCount: '1.2k',
          totalDuration: '4h 15m',
          status: userProgress ? (userProgress.calculated_status as Course['status']) : 'not-started',
          releaseDate: c.created_at,
          price: Number(c.price),
          slug: c.slug,
        };
      });
    } catch (err) {
      console.error('Failed to get published courses, using mock fallback:', err);
      return mockCourses;
    }
  },

  // 2. Get course details by slug or ID, including outline, enrollment state, and lessons
  getCourseBySlugOrId: async (slugOrId: string): Promise<CourseDetail | null> => {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

      let query = supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          description,
          thumbnail_url,
          category,
          level,
          price,
          status,
          created_at,
          updated_at,
          mentor_id,
          profiles:mentor_id (
            id,
            name,
            avatar,
            role
          )
        `);

      if (isUuid) {
        query = query.eq('id', slugOrId);
      } else {
        query = query.eq('slug', slugOrId);
      }

      const { data: course, error } = await query.maybeSingle();

      if (error || !course) {
        // Fallback to mock data by slug or id
        const mockMatch = mockCourses.find((c) => c.slug === slugOrId || c.id === slugOrId);
        if (mockMatch) {
          const isPaid = Number(mockMatch.price) > 0;
          let isEnrolled = false;
          try {
            const stored = localStorage.getItem('coursue_paid_enrollments') || '[]';
            const list: string[] = JSON.parse(stored);
            if (list.includes(mockMatch.id)) {
              isEnrolled = true;
            }
          } catch {}

          if (!isPaid) {
            isEnrolled = true;
          }

          const detail = mockCoursesDetail[mockMatch.id] || mockCoursesDetail[slugOrId];
          if (detail) {
            return {
              ...detail,
              price: mockMatch.price || 0,
              isEnrolled,
              status: isEnrolled ? 'in-progress' : 'not-started',
              access: isEnrolled ? 'Akses Penuh Aktif' : isPaid ? 'Kelas Berbayar' : 'Akses Gratis',
              sections: detail.sections.map((sec, sIdx) => ({
                ...sec,
                lessons: sec.lessons.map((l, lIdx) => ({
                  ...l,
                  isLocked: !isEnrolled && !(sIdx === 0 && lIdx === 0),
                })),
              })),
            };
          }

          return {
            id: mockMatch.id,
            title: mockMatch.title,
            slug: mockMatch.slug,
            category: mockMatch.category,
            categoryLabel: mockMatch.categoryLabel,
            thumbnail: mockMatch.thumbnail,
            rating: mockMatch.rating || 4.9,
            reviewsCount: mockMatch.reviewsCount || 120,
            studentsCount: String(mockMatch.studentsCount || '1.2k'),
            totalDuration: mockMatch.totalDuration || '12h 00m',
            lastUpdated: 'Oktober 2026',
            description: `Pelajari dan kuasai materi ${mockMatch.title} secara komprehensif, mulai dari konsep dasar hingga implementasi tingkat lanjut dengan bimbingan mentor berpengalaman.`,
            whatYouWillLearn: [
              `Memahami konsep fundamental dan studi kasus ${mockMatch.title}`,
              'Membangun portofolio dan proyek praktis nyata',
              'Praktik terbaik industri dan tips efisiensi kerja',
              'Sertifikat penyelesaian terverifikasi untuk profil profesional',
            ],
            requirements: [
              'Koneksi internet dan perangkat komputer (PC/Laptop)',
              'Kemauan dan komitmen belajar yang konsisten',
              'Tidak diperlukan keahlian awal khusus, materi dimulai dari dasar',
            ],
            level: mockMatch.level || 'Beginner',
            language: 'Indonesian (Bahasa Indonesia)',
            certificate: true,
            access: isEnrolled ? 'Akses Penuh Aktif' : isPaid ? 'Kelas Berbayar' : 'Akses Gratis',
            status: isEnrolled ? 'in-progress' : 'not-started',
            price: mockMatch.price || 0,
            isFavorite: mockMatch.isFavorite,
            isEnrolled,
            mentor: {
              id: 'm-default',
              name: mockMatch.mentor.name,
              role: mockMatch.mentor.role,
              avatar: mockMatch.mentor.avatar,
              bio: 'Praktisi industri dan instruktur profesional dengan pengalaman bertahun-tahun di bidangnya.',
              rating: 4.95,
              students: '12,000+ students',
              isFollowing: false,
            },
            sections: [
              {
                id: `s-${mockMatch.id}-1`,
                title: 'Section 1: Kurikulum & Materi Pembelajaran',
                lessons: [
                  {
                    id: `l-${mockMatch.id}-1`,
                    title: `Pengenalan & Fundamental ${mockMatch.title}`,
                    duration: '45:00',
                    isCompleted: false,
                    isLocked: false, // Lesson 1: Free Trial Preview
                    videoUrl: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
                  },
                  {
                    id: `l-${mockMatch.id}-2`,
                    title: `Konsep Inti & Arsitektur Utama`,
                    duration: '55:00',
                    isCompleted: false,
                    isLocked: !isEnrolled,
                    videoUrl: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
                  },
                  {
                    id: `l-${mockMatch.id}-3`,
                    title: `Studi Kasus & Implementasi Proyek`,
                    duration: '1h 10m',
                    isCompleted: false,
                    isLocked: !isEnrolled,
                    videoUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
                  },
                  {
                    id: `l-${mockMatch.id}-4`,
                    title: `Review Proyek Akhir & Best Practices`,
                    duration: '40:00',
                    isCompleted: false,
                    isLocked: !isEnrolled,
                    videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
                  },
                ],
              },
            ],
            reviews: [
              {
                id: 'r1',
                userName: 'Sarah Jenkins',
                userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                rating: 5,
                date: '2 hari yang lalu',
                comment: 'Materi sangat berbobot dan mudah dipahami! Mentor menjelaskan setiap langkah dengan runtut.',
              },
            ],
          };
        }
        console.warn('Course not found:', slugOrId, error);
        return null;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user;

      // Check enrollment
      let isEnrolled = false;
      if (currentUser) {
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('id, status')
          .eq('course_id', course.id)
          .eq('user_id', currentUser.id)
          .eq('status', 'active')
          .maybeSingle();

        isEnrolled = Boolean(enrollment);
      }

      if (!isEnrolled) {
        try {
          const stored = localStorage.getItem('coursue_paid_enrollments') || '[]';
          const list: string[] = JSON.parse(stored);
          if (list.includes(course.id)) {
            isEnrolled = true;
          }
        } catch {}
      }

      // Fetch lessons (if enrolled, full lessons with video are accessible via RLS; otherwise outline or preview lessons)
      let lessonsData: (DbLesson & { completed?: boolean })[] = [];

      const { data: lessons, error: lessonErr } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
        .order('position', { ascending: true });

      if (lessonErr || !lessons || lessons.length === 0) {
        // Fallback to course_outline view if lessons RLS blocked video
        const { data: outline } = await supabase
          .from('course_outline')
          .select('*')
          .eq('course_id', course.id)
          .order('position', { ascending: true });

        if (outline) {
          lessonsData = outline.map((o) => ({
            id: o.id,
            course_id: o.course_id,
            title: o.title,
            description: o.description,
            youtube_url: null,
            youtube_video_id: null,
            duration_seconds: o.duration_seconds,
            position: o.position,
            is_preview: o.is_preview,
            created_at: '',
            updated_at: '',
          }));
        }
      } else {
        lessonsData = lessons as DbLesson[];
      }

      // Fetch progress if user is logged in
      let completedLessonIds = new Set<string>();
      if (currentUser) {
        const { data: progressRows } = await supabase
          .from('lesson_progress')
          .select('lesson_id, completed')
          .eq('user_id', currentUser.id)
          .eq('completed', true);

        if (progressRows) {
          completedLessonIds = new Set(progressRows.map((r) => r.lesson_id));
        }
      }

      const totalDurationSecs = lessonsData.reduce((acc, l) => acc + (l.duration_seconds || 0), 0);

      // Structure curriculum into sections
      const curriculumLessons: CurriculumLesson[] = lessonsData.map((l) => {
        const isCompleted = completedLessonIds.has(l.id);
        const isLocked = !isEnrolled && !l.is_preview;

        return {
          id: l.id,
          title: l.title,
          duration: formatDurationFromSeconds(l.duration_seconds),
          isCompleted,
          isLocked,
          videoUrl: l.youtube_video_id
            ? `https://www.youtube-nocookie.com/embed/${l.youtube_video_id}`
            : l.youtube_url || undefined,
        };
      });

      const sections: CourseSection[] = [
        {
          id: `sec-${course.id}`,
          title: 'Section 1: Course Curriculum & Lessons',
          lessons: curriculumLessons,
        },
      ];

      return {
        id: course.id,
        title: course.title,
        category: course.category as CategoryType,
        categoryLabel: getCategoryLabel(course.category),
        thumbnail:
          course.thumbnail_url ||
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        rating: 4.9,
        reviewsCount: 384,
        studentsCount: '3,840',
        totalDuration: formatDurationFromSeconds(totalDurationSecs),
        lastUpdated: new Date(course.updated_at || course.created_at).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        description:
          course.description ||
          'Pelajari materi komprehensif bersama mentor berpengalaman untuk menguasai kompetensi digital terkini.',
        whatYouWillLearn: [
          'Memahami konsep dasar hingga implementasi tingkat lanjut',
          'Membangun portofolio nyata yang siap ditunjukkan ke industri',
          'Menguasai best practices, tips efisiensi, dan standar industri modern',
          'Akses materi video interaktif dan modul terstruktur',
        ],
        requirements: [
          'Koneksi internet yang stabil untuk memutar video materi',
          'Kemauan untuk belajar dan mempraktikkan materi pembelajaran',
        ],
        level: normalizeLevel(course.level),
        language: 'Indonesian (Bahasa Indonesia)',
        certificate: true,
        access: isEnrolled ? 'Akses Penuh Aktif' : Number(course.price) === 0 ? 'Akses Gratis' : 'Kelas Berbayar',
        mentor: {
          id: (course.profiles as { id?: string } | null)?.id || 'mentor-default',
          name: (course.profiles as { name?: string } | null)?.name || 'Coursue Mentor',
          role: 'Lead Specialist & Educator',
          avatar:
            (course.profiles as { avatar?: string } | null)?.avatar ||
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
          bio: 'Praktisi industri dengan dedikasi tinggi dalam membimbing talenta digital masa depan.',
          rating: 4.95,
          students: '12,000+',
          isFollowing: false,
        },
        sections,
        reviews: [
          {
            id: 'rev-1',
            userName: 'Budi Santoso',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
            rating: 5,
            comment: 'Materi sangat jelas, langsung to the point dan mudah dipraktikkan!',
            date: '1 minggu lalu',
          },
          {
            id: 'rev-2',
            userName: 'Siti Rahma',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
            rating: 5,
            comment: 'Kualitas video dan penjelasannya luar biasa untuk kelas online.',
            date: '2 minggu lalu',
          },
        ],
        isFavorite: false,
        status: isEnrolled ? 'in-progress' : 'not-started',
        releaseDate: course.created_at,
        price: Number(course.price),
        isEnrolled,
      };
    } catch (err) {
      console.error('Failed to get course details:', err);
      return null;
    }
  },

  // 3. Self-enroll in a free published course
  enrollFreeCourse: async (courseId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        return {
          success: false,
          error: 'Silakan login terlebih dahulu untuk mendaftar kelas ini.',
        };
      }

      // Check course price first to give clean feedback
      const { data: course } = await supabase
        .from('courses')
        .select('id, price, status, title')
        .eq('id', courseId)
        .single();

      if (!course) {
        return { success: false, error: 'Kursus tidak ditemukan.' };
      }

      if (Number(course.price) > 0) {
        return {
          success: false,
          error: 'Pembayaran untuk kelas berbayar saat ini belum tersedia.',
        };
      }

      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          status: 'active',
          source: 'free',
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return { success: true }; // Already enrolled
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Error during free enrollment:', err);
      return { success: false, error: 'Gagal melakukan pendaftaran kursus.' };
    }
  },

  // 3b. Self-enroll in a paid course via simulated payment
  enrollPaidCourse: async (
    courseId: string,
    paymentMethod = 'qris'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Record in local paid enrollments storage
      try {
        const stored = localStorage.getItem('coursue_paid_enrollments') || '[]';
        const list: string[] = JSON.parse(stored);
        if (!list.includes(courseId)) {
          list.push(courseId);
          localStorage.setItem('coursue_paid_enrollments', JSON.stringify(list));
        }
      } catch (e) {
        console.warn('Failed to update local paid enrollments:', e);
      }

      // 2. Insert into Supabase if authenticated
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (user) {
        const { error } = await supabase
          .from('enrollments')
          .insert({
            course_id: courseId,
            user_id: user.id,
            status: 'active',
            source: 'purchase',
          });

        if (error && error.code !== '23505') {
          console.warn('Notice inserting paid enrollment to Supabase:', error.message);
        }
      }

      // 3. Dispatch global event so components re-evaluate enrollment state immediately
      window.dispatchEvent(
        new CustomEvent('coursue:course-enrolled', {
          detail: { courseId, source: 'purchase', paymentMethod },
        })
      );

      return { success: true };
    } catch (err) {
      console.error('Error during paid course enrollment:', err);
      return { success: true };
    }
  },

  // 4. Get active user enrollments with calculated progress for "Continue Watching"
  getMyEnrollments: async (): Promise<Course[]> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) return [];

      const { data: progressRows, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('enrollment_status', 'active');

      if (error) {
        console.error('Error fetching my enrollments:', error);
        return [];
      }

      if (!progressRows || progressRows.length === 0) {
        return [];
      }

      return progressRows.map((p) => ({
        id: p.course_id,
        title: p.course_title,
        category: p.course_category as CategoryType,
        categoryLabel: getCategoryLabel(p.course_category),
        thumbnail:
          p.course_thumbnail ||
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        progress: Number(p.progress_percentage),
        mentor: {
          name: 'Coursue Mentor',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          role: 'Instructor',
        },
        isFavorite: false,
        level: normalizeLevel(p.course_level),
        rating: 4.9,
        reviewsCount: 156,
        studentsCount: '1.5k',
        totalDuration: `${p.total_lessons} lessons`,
        status: p.calculated_status as Course['status'],
        releaseDate: p.enrolled_at,
        price: Number(p.course_price),
        slug: p.course_slug,
      }));
    } catch (err) {
      console.error('Failed to get user enrollments:', err);
      return [];
    }
  },

  // 5. Get top 3 progress summaries for student dashboard cards
  getMyProgressSummaries: async (): Promise<ProgressSummary[]> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) return [];

      const { data: progressRows, error } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('enrollment_status', 'active')
        .limit(3);

      if (error || !progressRows) return [];

      return progressRows.map((p) => ({
        id: p.course_id,
        category: p.course_category as CategoryType,
        title: p.course_title,
        watched: p.completed_lessons,
        total: p.total_lessons,
        icon: p.course_category,
      }));
    } catch (err) {
      console.error('Failed to get progress summaries:', err);
      return [];
    }
  },

  // 6. Get enrolled lessons for student dashboard "Your Lesson" table
  getRecentLessonsForUser: async (): Promise<Lesson[]> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) return [];

      // Query lessons from courses the user is actively enrolled in
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id,
          title,
          description,
          duration_seconds,
          position,
          course_id,
          courses (
            id,
            title,
            category,
            profiles:mentor_id (
              name,
              avatar
            )
          )
        `)
        .order('position', { ascending: true })
        .limit(6);

      if (error || !data) return [];

      return (data as unknown as {
        id: string;
        title: string;
        description: string;
        courses?: {
          id: string;
          title: string;
          category: string;
          profiles?: { name?: string; avatar?: string } | null;
        } | null;
      }[]).map((row) => ({
        id: row.id,
        courseId: row.courses?.id,
        title: row.title,
        mentorName: row.courses?.profiles?.name || 'Leonardo Samsul',
        mentorAvatar:
          row.courses?.profiles?.avatar ||
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        date: 'Today',
        type: (row.courses?.category as CategoryType) || 'frontend',
        typeLabel: getCategoryLabel(row.courses?.category || 'frontend'),
        description: row.description || row.title,
      }));
    } catch (err) {
      console.error('Failed to get recent lessons:', err);
      return [];
    }
  },

  // 7. Get full lessons for course (accessible if user is enrolled or lesson is preview)
  getLessonsForCourse: async (courseId: string): Promise<DbLesson[]> => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching lessons:', error);
        return [];
      }

      return (data as DbLesson[]) || [];
    } catch (err) {
      console.error('Failed to get lessons for course:', err);
      return [];
    }
  },

  // 8. Save user video playback position
  saveLessonProgress: async (
    lessonId: string,
    lastPositionSeconds: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return { success: false, error: 'Unauthorized' };

      const { error } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            last_position_seconds: Math.floor(lastPositionSeconds),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err) {
      console.error('Error saving lesson progress:', err);
      return { success: false, error: 'Failed to save progress' };
    }
  },

  // 9. Toggle or mark lesson completion
  markLessonCompleted: async (
    lessonId: string,
    completed = true
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) return { success: false, error: 'Unauthorized' };

      const { error } = await supabase
        .from('lesson_progress')
        .upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            completed,
            completed_at: completed ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_id' }
        );

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      return { success: false, error: 'Failed to update lesson completion' };
    }
  },

  // 10. Get all published courses for student Explore page with lesson count and enrollment state
  getExploreCourses: async (): Promise<ExploreCourse[]> => {
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          description,
          thumbnail_url,
          category,
          level,
          price,
          status,
          created_at,
          updated_at,
          mentor_id,
          profiles:mentor_id (
            id,
            name,
            avatar,
            role
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error || !courses || courses.length === 0) {
        if (error) console.warn('Notice fetching explore courses from Supabase (using mock fallback):', error.message);
        const stored = localStorage.getItem('coursue_paid_enrollments') || '[]';
        const paidList: string[] = JSON.parse(stored);
        return mockCourses.map((c) => ({
          id: c.id,
          title: c.title,
          slug: c.slug || c.id,
          description: `Pelajari materi komprehensif ${c.title} bersama mentor industri berpengalaman.`,
          thumbnail: c.thumbnail,
          category: c.category,
          categoryLabel: c.categoryLabel,
          level: c.level || 'Beginner',
          price: c.price || 0,
          lessonsCount: 8,
          isEnrolled: paidList.includes(c.id),
          mentor: c.mentor,
        }));
      }

      // Fetch user session
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      // Fetch active enrollments
      const enrolledSet = new Set<string>();
      if (userId) {
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', userId)
          .eq('status', 'active');

        if (enrollments) {
          enrollments.forEach((e) => enrolledSet.add(e.course_id));
        }
      }

      try {
        const stored = localStorage.getItem('coursue_paid_enrollments') || '[]';
        const list: string[] = JSON.parse(stored);
        list.forEach((id: string) => enrolledSet.add(id));
      } catch {}

      // Fetch lesson counts from course_outline
      const lessonCountMap: Record<string, number> = {};
      try {
        const { data: outline } = await supabase
          .from('course_outline')
          .select('course_id');

        if (outline) {
          outline.forEach((item) => {
            lessonCountMap[item.course_id] = (lessonCountMap[item.course_id] || 0) + 1;
          });
        }
      } catch {
        // Outline query fallback
      }

      return (courses as any[]).map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description || '',
        thumbnail:
          c.thumbnail_url ||
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        category: c.category as CategoryType,
        categoryLabel: getCategoryLabel(c.category),
        level: normalizeLevel(c.level),
        price: Number(c.price) || 0,
        lessonsCount: lessonCountMap[c.id] || 0,
        isEnrolled: enrolledSet.has(c.id),
        mentor: {
          name: c.profiles?.name || 'Coursue Mentor',
          avatar:
            c.profiles?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
              c.profiles?.name || 'Mentor'
            )}`,
          role: c.profiles?.role === 'admin' ? 'Administrator' : 'Lead Instructor',
        },
      }));
    } catch (err) {
      console.error('Failed to get explore courses:', err);
      return [];
    }
  },
};
