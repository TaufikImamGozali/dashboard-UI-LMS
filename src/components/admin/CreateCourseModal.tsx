import React, { useState } from 'react';
import { X, BookPlus, Loader2, AlertCircle } from 'lucide-react';
import { generateSlug } from '../../utils/adminHelpers';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: {
    title: string;
    description?: string;
    category: 'frontend' | 'design' | 'branding' | 'mobile' | 'devops' | 'general';
    level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail_url?: string;
    price: number;
    status: 'draft' | 'published';
  }) => Promise<any> | void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'frontend' | 'design' | 'branding' | 'mobile' | 'devops' | 'general'>('design');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const slugPreview = generateSlug(title) || 'course-slug';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        level,
        thumbnail_url: thumbnail.trim() || undefined,
        price: Number(price) || 0,
        status,
      });

      onClose();
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-modal bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-course-title"
        className="w-full max-w-lg bg-surface rounded-3xl p-6 sm:p-7 border border-outline shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-outline-subtle mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 flex items-center justify-center">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="create-course-title" className="text-lg font-bold text-content-primary">
                Add New Course
              </h2>
              <p className="text-xs text-content-muted">Publish or draft a new course for students</p>
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

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-content-secondary mb-1.5">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced Design Systems with Figma"
              className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
            />
            {title.trim() && (
              <p className="mt-1 text-meta text-content-muted font-mono">
                Auto-slug: <span className="text-brand-600 font-semibold">{slugPreview}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-content-secondary mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
              >
                <option value="frontend">Front End</option>
                <option value="design">UI/UX Design</option>
                <option value="branding">Branding</option>
                <option value="mobile">Mobile Dev</option>
                <option value="devops">DevOps</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-content-secondary mb-1.5">
                Difficulty Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-content-secondary mb-1.5">
                Price (USD, 0 = Free)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-content-secondary mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-content-secondary mb-1.5">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
            />
          </div>

          <div>
            <label className="block font-bold text-content-secondary mb-1.5">
              Course Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short overview of what students will learn..."
              className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-outline text-content-secondary hover:bg-surface-muted font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-purple-glow transition-all disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Create Course</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
