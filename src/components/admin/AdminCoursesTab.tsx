import React, { useState, useMemo } from 'react';
import type { AdminCourse } from '../../types/admin';
import {
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Video,
  Edit3,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { CreateCourseModal } from './CreateCourseModal';
import { EditCourseModal } from './EditCourseModal';
import { AdminLessonsModal } from './AdminLessonsModal';

interface AdminCoursesTabProps {
  courses: AdminCourse[];
  onTogglePublish: (courseId: string) => void;
  onDeleteCourse: (courseId: string) => Promise<{ success: boolean; hasEnrollments: boolean; enrollmentCount?: number; message?: string }> | void;
  onAddCourse: (course: any) => Promise<any> | void;
  onEditCourse?: (courseId: string, data: any) => Promise<any> | void;
  onRefreshCourses?: () => void;
}

export const AdminCoursesTab: React.FC<AdminCoursesTabProps> = ({
  courses,
  onTogglePublish,
  onDeleteCourse,
  onAddCourse,
  onEditCourse,
  onRefreshCourses,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);
  const [managingLessonsCourse, setManagingLessonsCourse] = useState<AdminCourse | null>(null);

  // Safe delete dialog state
  const [deleteCandidate, setDeleteCandidate] = useState<AdminCourse | null>(null);
  const [enrollmentBlockedWarning, setEnrollmentBlockedWarning] = useState<{
    course: AdminCourse;
    count: number;
    message: string;
  } | null>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase()) ||
        (c.slug ? c.slug.toLowerCase().includes(search.toLowerCase()) : false);
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [courses, search, categoryFilter, statusFilter]);

  const handleDeleteClick = async (course: AdminCourse) => {
    // Check if course already shows students count > 0
    if (course.studentsCount > 0) {
      setEnrollmentBlockedWarning({
        course,
        count: course.studentsCount,
        message: `Kursus "${course.title}" memiliki ${course.studentsCount} siswa terdaftar. Penghapusan permanen dicegah demi menjaga riwayat dan progres belajar siswa.`,
      });
      return;
    }

    // Try deleting or prompt confirmation
    setDeleteCandidate(course);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const target = deleteCandidate;
    setDeleteCandidate(null);

    const res = await onDeleteCourse(target.id);
    if (res && !res.success && res.hasEnrollments) {
      setEnrollmentBlockedWarning({
        course: target,
        count: res.enrollmentCount || 1,
        message: res.message || 'Penghapusan permanen ditolak karena kursus memiliki siswa terdaftar.',
      });
    }
  };

  const handleConvertToDraft = async () => {
    if (!enrollmentBlockedWarning) return;
    const courseId = enrollmentBlockedWarning.course.id;
    if (enrollmentBlockedWarning.course.status === 'published') {
      await onTogglePublish(courseId);
    }
    setEnrollmentBlockedWarning(null);
  };

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course title, slug, or mentor..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter courses by category"
            className="px-3.5 py-2 rounded-full border border-outline bg-surface text-xs text-content-secondary focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="frontend">Front End</option>
            <option value="design">UI/UX Design</option>
            <option value="branding">Branding</option>
            <option value="mobile">Mobile Dev</option>
            <option value="devops">DevOps</option>
            <option value="general">General</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
            aria-label="Filter courses by status"
            className="px-3.5 py-2 rounded-full border border-outline bg-surface text-xs text-content-secondary focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-purple-glow shrink-0 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Course</span>
        </button>
      </div>

      {/* Course Table */}
      <div className="rounded-3xl bg-surface border border-outline shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted border-b border-outline-subtle text-content-muted font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Course</th>
                <th className="px-4 py-3.5">Category & Level</th>
                <th className="px-4 py-3.5">Curriculum</th>
                <th className="px-4 py-3.5">Students</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-content-primary">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-content-muted">
                    No courses match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-12 h-10 rounded-lg object-cover ring-1 ring-outline-subtle shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-content-primary truncate max-w-xs">{c.title}</p>
                          <p className="text-meta text-content-muted font-mono truncate">/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2.5 py-0.5 rounded-full text-meta font-bold bg-brand-50 text-brand-600">
                          {c.categoryLabel}
                        </span>
                        <span className="text-[10px] text-content-muted uppercase font-semibold">
                          {c.level || 'Beginner'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setManagingLessonsCourse(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline hover:border-brand-500 hover:text-brand-600 font-bold text-xs bg-surface transition-all"
                        title="Manage lessons for this course"
                      >
                        <Video className="w-3.5 h-3.5 text-brand-500" />
                        <span>{c.lessonsCount || 0} Lessons</span>
                      </button>
                    </td>
                    <td className="px-4 py-4 font-semibold text-content-primary">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-content-muted" />
                        {c.studentsCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-content-primary">
                      {c.price === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `$${c.price}`
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => onTogglePublish(c.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-meta font-bold transition-all ${
                          c.status === 'published'
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {c.status === 'published' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5" /> Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingCourse(c)}
                          className="p-1.5 rounded-lg text-content-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit course details"
                          aria-label={`Edit ${c.title}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(c)}
                          className="p-1.5 rounded-lg text-content-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete course"
                          aria-label={`Delete ${c.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={onAddCourse}
      />

      {/* Edit Course Modal */}
      {editingCourse && (
        <EditCourseModal
          key={editingCourse.id}
          isOpen={!!editingCourse}
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSubmit={async (id, data) => {
            if (onEditCourse) {
              await onEditCourse(id, data);
            }
          }}
        />
      )}

      {/* Curriculum / Lessons Manager Modal */}
      {managingLessonsCourse && (
        <AdminLessonsModal
          isOpen={!!managingLessonsCourse}
          courseId={managingLessonsCourse.id}
          courseTitle={managingLessonsCourse.title}
          onClose={() => setManagingLessonsCourse(null)}
          onLessonsChanged={() => {
            if (onRefreshCourses) onRefreshCourses();
          }}
        />
      )}

      {/* Normal Delete Confirmation Dialog (for courses with 0 enrollments) */}
      {deleteCandidate && (
        <div
          className="fixed inset-0 z-modal bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeleteCandidate(null)}
        >
          <div
            className="w-full max-w-sm bg-surface rounded-3xl p-6 border border-outline shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-content-primary">Delete Course Permanently</h3>
              <p className="text-xs text-content-secondary mt-1">
                Are you sure you want to permanently delete <strong>"{deleteCandidate.title}"</strong>?
                This course currently has 0 enrollments. All lessons associated will also be removed.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-full border border-outline text-xs font-semibold hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Deletion Warning: Safe protection for courses with enrollments */}
      {enrollmentBlockedWarning && (
        <div
          className="fixed inset-0 z-modal bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEnrollmentBlockedWarning(null)}
        >
          <div
            className="w-full max-w-md bg-surface rounded-3xl p-6 border border-outline shadow-2xl space-y-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-content-primary">
                Penghapusan Permanen Ditahan
              </h3>
              <p className="text-xs text-content-secondary mt-2 leading-relaxed">
                {enrollmentBlockedWarning.message}
              </p>
              <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800">
                <strong>Kebijakan Keamanan:</strong> Menghapus kursus ber-enrollment akan menghapus progres belajar, riwayat materi, dan sertifikat siswa. Sebagai alternatif yang aman, alihkan kursus menjadi <strong>Draft</strong> agar tidak bisa diakses siswa baru, sementara siswa terdaftar tetap aman.
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEnrollmentBlockedWarning(null)}
                className="px-4 py-2 rounded-full border border-outline text-xs font-semibold hover:bg-surface-muted"
              >
                Tutup
              </button>
              {enrollmentBlockedWarning.course.status === 'published' && (
                <button
                  type="button"
                  onClick={handleConvertToDraft}
                  className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs"
                >
                  Ubah ke Draft (Unpublish)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
