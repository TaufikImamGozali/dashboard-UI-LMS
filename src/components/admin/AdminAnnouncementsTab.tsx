import React, { useEffect, useState, useCallback } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Sparkles,
  BookOpen,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  announcementService,
  type AnnouncementItem,
  type AnnouncementFormData,
} from '../../services/announcementService';
import { courseService } from '../../services/courseService';
import type { Course } from '../../types';

interface AdminAnnouncementsTabProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminAnnouncementsTab: React.FC<AdminAnnouncementsTabProps> = ({
  onShowToast,
}) => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [form, setForm] = useState<AnnouncementFormData>({
    title: '',
    body: '',
    courseId: null,
    isPublished: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState<AnnouncementItem | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [announcementList, courseList] = await Promise.all([
        announcementService.getAllAnnouncementsAdmin(),
        courseService.getPublishedCourses(),
      ]);
      setAnnouncements(announcementList);
      setCourses(courseList);
    } catch (err: any) {
      onShowToast(err.message || 'Gagal memuat daftar pengumuman', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const [announcementList, courseList] = await Promise.all([
          announcementService.getAllAnnouncementsAdmin(),
          courseService.getPublishedCourses(),
        ]);
        if (mounted) {
          setAnnouncements(announcementList);
          setCourses(courseList);
        }
      } catch (err: any) {
        if (mounted) onShowToast(err.message || 'Gagal memuat daftar pengumuman', 'error');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [onShowToast]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      body: '',
      courseId: null,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: AnnouncementItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      body: item.body,
      courseId: item.courseId,
      isPublished: item.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      onShowToast('Judul dan isi pengumuman wajib diisi', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        const res = await announcementService.updateAnnouncement(editingItem.id, form);
        if (!res.success) {
          onShowToast(res.error || 'Gagal memperbarui pengumuman', 'error');
        } else {
          onShowToast('Pengumuman berhasil diperbarui', 'success');
          setIsModalOpen(false);
          await loadData();
        }
      } else {
        const res = await announcementService.createAnnouncement(form);
        if (!res.success) {
          onShowToast(res.error || 'Gagal membuat pengumuman', 'error');
        } else {
          onShowToast('Pengumuman baru berhasil diterbitkan', 'success');
          setIsModalOpen(false);
          await loadData();
        }
      }
    } catch (err: any) {
      onShowToast(err.message || 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (item: AnnouncementItem) => {
    const nextStatus = !item.isPublished;
    const res = await announcementService.togglePublish(item.id, nextStatus);
    if (res.success) {
      onShowToast(
        nextStatus
          ? 'Pengumuman sekarang aktif & dapat dilihat siswa'
          : 'Pengumuman disembunyikan (draft)',
        'info'
      );
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, isPublished: nextStatus } : a))
      );
    } else {
      onShowToast(res.error || 'Gagal mengubah status publikasi', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await announcementService.deleteAnnouncement(
      deleteTarget.id,
      deleteTarget.title
    );
    if (res.success) {
      onShowToast('Pengumuman berhasil dihapus', 'success');
      setAnnouncements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      onShowToast(res.error || 'Gagal menghapus pengumuman', 'error');
    }
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase()) ||
      (a.courseTitle && a.courseTitle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface p-4 rounded-2xl border border-outline shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pengumuman..."
            className="w-full pl-10 pr-4 py-2 bg-surface-muted rounded-xl text-sm border border-transparent focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 text-content-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2.5 rounded-xl border border-outline hover:bg-surface-muted text-content-secondary hover:text-brand-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-purple-glow transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman</span>
          </button>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-surface rounded-2xl border border-outline overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted border-b border-outline text-xs font-bold text-content-secondary uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Judul & Isi</th>
                <th className="py-3.5 px-4">Target Siswa</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-content-muted">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-500" />
                    <span>Memuat data pengumuman...</span>
                  </td>
                </tr>
              ) : filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-muted/50 transition-colors">
                    {/* Title & Body preview */}
                    <td className="py-4 px-4 sm:px-6 max-w-xs sm:max-w-md">
                      <p className="font-bold text-content-primary leading-snug line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-content-muted line-clamp-1 mt-0.5">
                        {item.body}
                      </p>
                    </td>

                    {/* Target */}
                    <td className="py-4 px-4">
                      {item.courseTitle ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60 max-w-[200px] truncate">
                          <BookOpen className="w-3 h-3 shrink-0 text-purple-600" />
                          <span className="truncate">{item.courseTitle}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Semua Siswa (Umum)</span>
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          item.isPublished
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {item.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Terbit</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-content-muted whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg text-content-secondary hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-1.5 rounded-lg text-content-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-content-muted">
                    Belum ada pengumuman yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-modal bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-scale-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-surface rounded-shell p-6 sm:p-7 border border-outline shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-outline-subtle pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-content-primary">
                  {editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-muted text-content-secondary hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Target Course Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-content-secondary">
                  Target Penerima Pengumuman
                </label>
                <select
                  value={form.courseId || ''}
                  onChange={(e) =>
                    setForm({ ...form, courseId: e.target.value ? e.target.value : null })
                  }
                  className="w-full px-3.5 py-2.5 bg-surface-muted rounded-xl text-sm border border-outline text-content-primary focus:border-brand-400 focus:outline-none"
                >
                  <option value="">🌟 Semua Siswa (Pengumuman Umum)</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      📚 Khusus Kelas: {c.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-content-muted">
                  Jika memilih kelas tertentu, hanya siswa yang terdaftar aktif di kelas tersebut yang dapat membacanya.
                </p>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-content-secondary">
                  Judul Pengumuman
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Pembaruan Materi Modul 3 Telah Rilis"
                  className="w-full px-3.5 py-2.5 bg-surface-muted rounded-xl text-sm border border-outline text-content-primary focus:border-brand-400 focus:outline-none"
                />
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-content-secondary">
                  Isi Pesan
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Tuliskan isi pengumuman secara rinci..."
                  className="w-full px-3.5 py-2.5 bg-surface-muted rounded-xl text-sm border border-outline text-content-primary focus:border-brand-400 focus:outline-none"
                />
              </div>

              {/* Published checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-500 border-outline accent-brand-500"
                />
                <span className="text-xs font-bold text-content-primary">
                  Terbitkan sekarang (langsung dapat dilihat siswa)
                </span>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-outline-subtle">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-outline text-content-secondary text-sm font-bold hover:bg-surface-muted"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-purple-glow disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : editingItem ? 'Simpan Perubahan' : 'Terbitkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-modal bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-scale-in"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm bg-surface rounded-shell p-6 border border-outline shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-content-primary">
                Hapus Pengumuman?
              </h3>
              <p className="text-xs text-content-muted leading-relaxed">
                Pengumuman <span className="font-semibold text-content-primary">"{deleteTarget.title}"</span> akan dihapus secara permanen.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="py-2.5 rounded-full border border-outline text-content-secondary text-xs font-bold hover:bg-surface-muted"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
