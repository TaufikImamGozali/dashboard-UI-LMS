export type CategoryType = 'frontend' | 'design' | 'branding';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'Friend' | 'Old Friend';
  isOnline?: boolean;
}

export interface ProgressSummary {
  id: string;
  category: CategoryType;
  title: string;
  watched: number;
  total: number;
  icon: string;
}

export interface Course {
  id: string;
  title: string;
  category: CategoryType;
  categoryLabel: string;
  thumbnail: string;
  progress: number; // percentage 0-100
  mentor: {
    name: string;
    avatar: string;
    role: string;
  };
  isFavorite: boolean;
}

export interface Lesson {
  id: string;
  mentorName: string;
  mentorAvatar: string;
  date: string;
  type: CategoryType;
  typeLabel: string;
  description: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline?: boolean;
  isFollowing: boolean;
}

export interface StatisticDataPoint {
  range: string;
  hours: number;
  highlighted?: boolean;
}

export interface CurriculumLesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
}

export interface CourseReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CourseMentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  rating: number;
  students: string;
  isFollowing: boolean;
}

export interface CourseDetail {
  id: string;
  title: string;
  category: CategoryType;
  categoryLabel: string;
  thumbnail: string;
  rating: number;
  reviewsCount: number;
  studentsCount: string;
  totalDuration: string;
  lastUpdated: string;
  description: string;
  whatYouWillLearn: string[];
  requirements: string[];
  level: string;
  language: string;
  certificate: boolean;
  access: string;
  mentor: CourseMentor;
  sections: CourseSection[];
  reviews: CourseReview[];
  isFavorite: boolean;
}
