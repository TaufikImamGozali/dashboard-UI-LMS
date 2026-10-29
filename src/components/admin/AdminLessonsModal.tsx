import React, { useState, useEffect, useCallback } from 'react';
import type { AdminLesson } from '../../types/admin';
import { adminService } from '../../services/adminService';
import { extractYouTubeVideoId, formatDuration } from '../../utils/adminHelpers';
import {
  X,
  Plus,
  Play,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Loader2,
  Video,
} from 'lucide-react';

interface AdminLessonsModalProps {
  isOpen: boolean;
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  onLessonsChanged?: () => void;
}

export const AdminLessonsModal: React.FC<AdminLessonsModalProps> = ({
  isOpen,
  courseId,
  courseTitle,
  onClose,
  onLessonsChanged,
}) => {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [isPreview, setIsPreview] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Deletion confirm state
  const [deletingLesson, setDeletingLesson] = useState<AdminLesson | null>(null);

  const loadLessons = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getCourseLessons(courseId);
      setLessons(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    let active = true;
    if (isOpen && courseId) {
      adminService
        .getCourseLessons(courseId)
        .then((data) => {
          if (active) {
            setLessons(data);
            setLoading(false);
          }
        })
        .catch((err: any) => {
          if (active) {
            setError(err?.message || 'Failed to load lessons');
            setLoading(false);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  const ytValidation = extractYouTubeVideoId(youtubeUrl);

  const handleOpenAddForm = () => {
    setEditingLessonId(null);
    setTitle('');
    setDescription('');
    setYoutubeUrl('');
    setDurationMinutes(15);
    setIsPreview(false);
    setError(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (lesson: AdminLesson) => {
    setEditingLessonId(lesson.id);
    setTitle(lesson.title);
    setDescription(lesson.description || '');
    setYoutubeUrl(lesson.youtubeUrl || (lesson.youtubeVideoId ? `https://www.youtube.com/watch?v=${lesson.youtubeVideoId}` : ''));
    setDurationMinutes(Math.round(lesson.durationSeconds / 60) || 10);
    setIsPreview(lesson.isPreview);
    setError(null);
    setIsFormOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !youtubeUrl.trim()) return;

    if (!ytValidation.isValid) {
      setError('Please provide a valid YouTube URL or 11-digit video ID.');
      return;
    }

    setFormSubmitting(true);
    setError(null);

    try {
      const durationSeconds = Math.max(0, durationMinutes * 60);

      if (editingLessonId) {
        await adminService.updateLesson(editingLessonId, courseId, {
          title: title.trim(),
          description: description.trim() || null,
          youtubeUrl: youtubeUrl.trim(),
          durationSeconds,
          isPreview,
        });
      } else {
        await adminService.createLesson(courseId, {
          title: title.trim(),
          description: description.trim() || undefined,
          youtubeUrl: youtubeUrl.trim(),
          durationSeconds,
          isPreview,
        });
      }

      setIsFormOpen(false);
      await loadLessons();
      if (onLessonsChanged) onLessonsChanged();
    } catch (err: any) {
      setError(err?.message || 'Failed to save lesson');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!deletingLesson) return;
    try {
      await adminService.deleteLesson(deletingLesson.id, courseId);
      setDeletingLesson(null);
      await loadLessons();
      if (onLessonsChanged) onLessonsChanged();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete lesson');
    }
  };

  const handleMoveLesson = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    const newLessons = [...lessons];
    const [moved] = newLessons.splice(index, 1);
    newLessons.splice(targetIndex, 0, moved);

    // Optimistic UI update
    setLessons(newLessons);

    try {
      const orderedIds = newLessons.map((l) => l.id);
      await adminService.reorderLessons(courseId, orderedIds);
      if (onLessonsChanged) onLessonsChanged();
    } catch (err: any) {
      setError(err?.message || 'Failed to reorder lessons');
      // Rollback
      await loadLessons();
    }
  };

  return (
    <div
      className="fixed inset-0 z-modal bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-3xl max-h-[90vh] bg-surface rounded-3xl border border-outline shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-outline-subtle bg-surface-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-content-primary truncate">
                Curriculum Lessons
              </h2>
              <p className="text-xs text-content-muted truncate max-w-lg">
                Course: <span className="font-semibold text-content-primary">{courseTitle}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-muted text-content-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Add / Edit Form Drawer */}
          {isFormOpen ? (
            <form onSubmit={handleSaveLesson} className="p-5 rounded-2xl bg-surface-muted border border-outline space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-outline-subtle">
                <h3 className="text-xs font-bold uppercase tracking-wider text-content-primary">
                  {editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-content-muted hover:text-content-primary"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-secondary mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Design Thinking & User Journeys"
                  className="w-full px-3.5 py-2 rounded-xl border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-content-secondary mb-1">
                  YouTube Video Link or 11-digit Video ID *
                </label>
                <input
                  type="text"
                  required
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=kUMe1FH4CHE or youtu.be/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-outline bg-surface text-xs font-mono focus:border-brand-500 focus:outline-none"
                />

                {/* Live YouTube Extraction & Validation Feedback */}
                {youtubeUrl.trim() && (
                  <div className="mt-2 text-xs flex items-center gap-1.5">
                    {ytValidation.isValid ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Valid YouTube Video (ID: <code className="font-mono">{ytValidation.videoId}</code>)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Invalid YouTube URL format
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-content-secondary mb-1">
                    Approx Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 rounded-xl border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPreview}
                      onChange={(e) => setIsPreview(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-content-primary">
                      Free Preview (Publicly accessible before enrollment)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-secondary mb-1">
                  Lesson Summary / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key takeaways, resources or exercises for this video lesson..."
                  className="w-full px-3.5 py-2 rounded-xl border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-full border border-outline text-xs font-semibold hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || !ytValidation.isValid}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 disabled:opacity-50"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingLessonId ? 'Update Lesson' : 'Add Lesson'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-content-secondary">
                  Curriculum ({lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'})
                </h3>
                <p className="text-meta text-content-muted">
                  Use Up/Down arrows to adjust lesson sequence. Changes sync immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddForm}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 shadow-purple-glow transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lesson</span>
              </button>
            </div>
          )}

          {/* Lessons List */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-content-muted gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
              <p className="text-xs">Loading curriculum lessons...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border-2 border-dashed border-outline-subtle bg-surface-muted/30">
              <Play className="w-8 h-8 text-content-muted mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-content-primary">No lessons in this course yet</p>
              <p className="text-meta text-content-muted mb-4">
                Add YouTube video lectures to make this course ready for students.
              </p>
              <button
                type="button"
                onClick={handleOpenAddForm}
                className="px-4 py-2 rounded-full bg-brand-500 text-white text-xs font-bold hover:bg-brand-600"
              >
                Add First Lesson
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-3.5 rounded-2xl bg-surface border border-outline hover:border-brand-200 shadow-xs flex items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Position badge */}
                    <div className="w-7 h-7 rounded-lg bg-surface-muted border border-outline flex items-center justify-center text-xs font-mono font-bold text-content-secondary shrink-0">
                      {lesson.position}
                    </div>

                    {/* Lesson Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-content-primary truncate">
                          {lesson.title}
                        </h4>
                        {lesson.isPreview && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            <Eye className="w-3 h-3" /> Free Preview
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-content-muted font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDuration(lesson.durationSeconds)}
                        </span>
                        {lesson.youtubeVideoId && (
                          <span className="truncate">
                            YT ID: <span className="text-content-secondary">{lesson.youtubeVideoId}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLesson(idx, 'up')}
                      className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === lessons.length - 1}
                      onClick={() => handleMoveLesson(idx, 'down')}
                      className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-surface-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditForm(lesson)}
                      className="p-1.5 rounded-lg text-content-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      title="Edit Lesson"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingLesson(lesson)}
                      className="p-1.5 rounded-lg text-content-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Lesson"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-subtle bg-surface-muted/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-surface border border-outline hover:bg-surface-muted text-xs font-bold text-content-primary"
          >
            Done
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingLesson && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeletingLesson(null)}
        >
          <div
            className="w-full max-w-sm bg-surface rounded-3xl p-6 border border-outline shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-content-primary">Delete Lesson</h3>
              <p className="text-xs text-content-secondary mt-1">
                Are you sure you want to remove lesson <strong>"{deletingLesson.title}"</strong>? Remaining lessons will be renumbered automatically.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingLesson(null)}
                className="px-4 py-2 rounded-full border border-outline text-xs font-semibold hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteLesson}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
