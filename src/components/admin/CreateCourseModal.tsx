import React, { useState } from 'react';
import { X, BookPlus } from 'lucide-react';
import type { AdminCourse } from '../../types/admin';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<AdminCourse, 'id' | 'createdAt' | 'studentsCount' | 'rating'>) => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'frontend' | 'design' | 'branding'>('design');
  const [instructor, setInstructor] = useState('Sarah Connor');
  const [price, setPrice] = useState(49);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const categoryLabels: Record<string, string> = {
      frontend: 'Front End',
      design: 'UI/UX Design',
      branding: 'Branding',
    };

    onSubmit({
      title: title.trim(),
      category,
      categoryLabel: categoryLabels[category] || 'UI/UX Design',
      instructor,
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      price: Number(price) || 49,
      status,
      thumbnail,
    });

    onClose();
    setTitle('');
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
        className="w-full max-w-lg bg-surface rounded-3xl p-6 sm:p-7 border border-outline shadow-2xl animate-scale-in"
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

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-content-secondary mb-1.5">
              Course Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced Design Systems with Figma"
              className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 bg-surface outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-content-secondary mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'frontend' | 'design' | 'branding')}
                className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
              >
                <option value="design">UI/UX Design</option>
                <option value="frontend">Front End</option>
                <option value="branding">Branding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-content-secondary mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-content-secondary mb-1.5">
                Price (USD)
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-content-secondary mb-1.5">
                Instructor
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-content-secondary mb-1.5">
              Thumbnail URL
            </label>
            <input
              type="url"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-outline focus:border-brand-500 bg-surface outline-none transition-all text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-subtle mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-outline hover:bg-surface-muted text-content-secondary font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-purple-glow transition-all"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
