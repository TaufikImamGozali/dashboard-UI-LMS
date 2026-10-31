import React, { useEffect, useState } from 'react';
import {
  FileCode2,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
  Send,
  AlertCircle,
  Award,
  RefreshCw,
  FolderGit2,
} from 'lucide-react';
import { assignmentService } from '../../services/assignmentService';
import type { DbCourseAssignment, DbAssignmentSubmission } from '../../types';
import { Button } from '../ui/Button';

interface CourseAssignmentTabProps {
  courseId: string;
  isEnrolled: boolean;
  isAllLessonsCompleted: boolean;
}

export const CourseAssignmentTab: React.FC<CourseAssignmentTabProps> = ({
  courseId,
  isEnrolled,
  isAllLessonsCompleted,
}) => {
  const [assignment, setAssignment] = useState<DbCourseAssignment | null>(null);
  const [submission, setSubmission] = useState<DbAssignmentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [projectUrl, setProjectUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await assignmentService.getAssignmentByCourse(courseId);
        if (!isMounted) return;
        setAssignment(data);

        if (data && isEnrolled) {
          const mySub = await assignmentService.getMySubmission(data.id);
          if (!isMounted) return;
          setSubmission(mySub);
          if (mySub) {
            setProjectUrl(mySub.project_url);
            setNotes(mySub.notes || '');
          }
        }
      } catch (err) {
        console.error('Failed to load course assignment:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [courseId, isEnrolled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignment) return;

    const trimmedUrl = projectUrl.trim();
    if (!trimmedUrl) {
      setFormError('URL repositori proyek atau tautan demo wajib diisi.');
      return;
    }

    // Basic URL validation
    try {
      new URL(trimmedUrl);
    } catch {
      setFormError('Format URL tidak valid. Gunakan format lengkap, misal: https://github.com/...');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setSuccessNotice('');

    const res = await assignmentService.submitAssignment(
      courseId,
      assignment.id,
      trimmedUrl,
      notes
    );

    setIsSubmitting(false);

    if (res.success && res.data) {
      setSubmission(res.data);
      setIsEditing(false);
      setSuccessNotice('Proyek evaluasi berhasil dikumpulkan! Mentor akan segera mereview karya Anda.');
    } else {
      setFormError(res.error || 'Gagal mengumpulkan tugas.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
        <p className="text-xs text-slateText-muted">Memuat instruksi evaluasi & tugas akhir...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-8 rounded-card bg-surface border border-outline text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
          <FileCode2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slateText-primary">
          Evaluasi Kursus Sedang Disiapkan
        </h3>
        <p className="text-xs text-slateText-secondary max-w-md mx-auto">
          Instruktur sedang mempersiapkan tugas evaluasi akhir untuk kursus ini. Silakan selesaikan seluruh materi video yang tersedia terlebih dahulu!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-card bg-surface border border-outline shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-meta font-extrabold tracking-wide uppercase bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Evaluasi Akhir Kursus
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slateText-muted">
              <Clock className="w-3.5 h-3.5" /> Estimasi {assignment.due_days} hari
            </span>
          </div>

          {submission?.status === 'approved' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
              <Award className="w-3.5 h-3.5" /> Lulus Evaluasi
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-slateText-primary tracking-tight">
            {assignment.title}
          </h2>
          <p className="text-sm text-slateText-secondary leading-relaxed whitespace-pre-line">
            {assignment.description}
          </p>
        </div>

        {/* Requirements Checklist */}
        {assignment.requirements && assignment.requirements.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-darkBorder space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slateText-muted">
              Persyaratan Proyek & Kriteria Kelulusan:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {assignment.requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-surface-muted border border-outline text-xs text-slateText-secondary"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Submission Status Display */}
      {submission && !isEditing && (
        <div
          className={`p-6 rounded-card border space-y-4 shadow-2xs ${
            submission.status === 'approved'
              ? 'bg-emerald-500/5 border-emerald-200 dark:border-emerald-800'
              : submission.status === 'rejected'
              ? 'bg-rose-500/5 border-rose-200 dark:border-rose-800'
              : 'bg-brand-500/5 border-brand-200 dark:border-brand-800'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  submission.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-600'
                    : submission.status === 'rejected'
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-brand-100 text-brand-600'
                }`}
              >
                {submission.status === 'approved' ? (
                  <Award className="w-5 h-5" />
                ) : (
                  <FolderGit2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slateText-primary">
                  {submission.status === 'approved'
                    ? 'Selamat! Proyek Anda Dinyatakan Lulus 🎉'
                    : submission.status === 'rejected'
                    ? 'Proyek Perlu Direvisi'
                    : 'Proyek Berhasil Dikumpulkan'}
                </h4>
                <p className="text-xs text-slateText-muted">
                  Dikumpulkan pada {new Date(submission.submitted_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            {submission.status !== 'approved' && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-brand-500 hover:text-brand-600 underline cursor-pointer"
              >
                Edit Tautan
              </button>
            )}
          </div>

          {/* Submitted Link */}
          <div className="p-3 rounded-xl bg-surface border border-outline flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <ExternalLink className="w-4 h-4 text-brand-500 shrink-0" />
              <a
                href={submission.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-600 dark:text-brand-400 hover:underline truncate"
              >
                {submission.project_url}
              </a>
            </div>
            <a
              href={submission.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-surface-muted hover:bg-slate-200 text-slateText-primary font-bold shrink-0 text-[11px]"
            >
              Kunjungi
            </a>
          </div>

          {/* Notes */}
          {submission.notes && (
            <div className="text-xs text-slateText-secondary space-y-1">
              <span className="font-semibold text-slateText-primary">Catatan Siswa:</span>
              <p className="italic bg-surface p-2.5 rounded-xl border border-outline">
                &ldquo;{submission.notes}&rdquo;
              </p>
            </div>
          )}

          {/* Feedback & Grade */}
          {submission.feedback && (
            <div className="p-4 rounded-xl bg-surface border border-brand-200 dark:border-brand-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slateText-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Ulasan Mentor:
                </span>
                {submission.grade !== null && (
                  <span className="text-xs font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                    Nilai: {submission.grade}/100
                  </span>
                )}
              </div>
              <p className="text-xs text-slateText-secondary leading-relaxed">
                {submission.feedback}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submission Form */}
      {(!submission || isEditing) && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-card bg-surface border border-outline shadow-2xs space-y-4"
        >
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slateText-primary">
              {submission ? 'Perbarui Pengumpulan Proyek' : 'Form Pengumpulan Proyek Evaluasi'}
            </h3>
            <p className="text-xs text-slateText-secondary">
              Pastikan link repositori GitHub, deploy demo (Vercel/Netlify), atau Figma dapat diakses oleh publik/mentor.
            </p>
          </div>

          {!isAllLessonsCompleted && isEnrolled && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Info:</strong> Anda belum menyelesaikan seluruh materi video. Anda tetap boleh mengumpulkan proyek sekarang, namun kami sarankan untuk menonton semua materi agar pemahaman maksimal.
              </span>
            </div>
          )}

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label
                htmlFor="project-url"
                className="block text-xs font-bold text-slateText-primary uppercase tracking-wider mb-1.5"
              >
                URL Repositori / Demo Proyek <span className="text-rose-500">*</span>
              </label>
              <input
                id="project-url"
                type="url"
                required
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://github.com/username/project atau https://myproject.vercel.app"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-muted border border-outline text-xs text-slateText-primary placeholder:text-slateText-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label
                htmlFor="project-notes"
                className="block text-xs font-bold text-slateText-primary uppercase tracking-wider mb-1.5"
              >
                Catatan Siswa (Opsional)
              </label>
              <textarea
                id="project-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jelaskan fitur yang Anda buat, teknologi yang digunakan, atau catatan tambahan untuk mentor..."
                className="w-full px-4 py-2.5 rounded-xl bg-surface-muted border border-outline text-xs text-slateText-primary placeholder:text-slateText-muted focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
              className="rounded-full shadow-purple-glow"
              disabled={!isEnrolled}
            >
              {isEditing ? 'Simpan Perubahan' : 'Kirim Proyek Evaluasi'}
            </Button>

            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-semibold text-slateText-muted hover:text-slateText-primary cursor-pointer px-3 py-2"
              >
                Batal
              </button>
            )}

            {!isEnrolled && (
              <span className="text-xs text-rose-500 font-medium">
                * Anda harus mendaftar kelas ini terlebih dahulu untuk mengumpulkan proyek.
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
