import React, { useState, useMemo } from 'react';
import type { AdminCourse } from '../../types/admin';
import { Search, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { CreateCourseModal } from './CreateCourseModal';

interface AdminCoursesTabProps {
  courses: AdminCourse[];
  onTogglePublish: (courseId: string) => void;
  onDeleteCourse: (courseId: string) => void;
  onAddCourse: (course: Omit<AdminCourse, 'id' | 'createdAt' | 'studentsCount' | 'rating'>) => void;
}

export const AdminCoursesTab: React.FC<AdminCoursesTabProps> = ({
  courses,
  onTogglePublish,
  onDeleteCourse,
  onAddCourse,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'frontend' | 'design' | 'branding'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [courses, search, categoryFilter, statusFilter]);

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
              placeholder="Search course title or instructor..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'frontend' | 'design' | 'branding')}
            aria-label="Filter courses by category"
            className="px-3.5 py-2 rounded-full border border-outline bg-surface text-xs text-content-secondary focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="design">UI/UX Design</option>
            <option value="frontend">Front End</option>
            <option value="branding">Branding</option>
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
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Instructor</th>
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
                          <p className="text-meta text-content-muted">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 rounded-full text-meta font-bold bg-brand-50 text-brand-600">
                        {c.categoryLabel}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-content-secondary">
                      {c.instructor}
                    </td>
                    <td className="px-4 py-4 font-semibold text-content-primary">
                      {c.studentsCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-bold text-content-primary">
                      ${c.price}
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
                      <button
                        type="button"
                        onClick={() => onDeleteCourse(c.id)}
                        className="p-1.5 rounded-lg text-content-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete course"
                        aria-label={`Delete ${c.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateCourseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={onAddCourse}
      />
    </div>
  );
};
