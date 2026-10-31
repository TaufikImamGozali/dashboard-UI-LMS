/**
 * Favorite Service for Coursue LMS
 * Manages persisted favorite course IDs in localStorage with user isolation
 */

const STORAGE_PREFIX = 'coursue_favorites_';
const DEFAULT_INITIAL_FAVORITES = ['c2', 'c5', 'c15'];

export const favoriteService = {
  getStorageKey(userId?: string | null): string {
    return `${STORAGE_PREFIX}${userId || 'guest'}`;
  },

  getFavorites(userId?: string | null): string[] {
    try {
      const key = this.getStorageKey(userId);
      const raw = localStorage.getItem(key);
      if (raw === null) {
        // First initialization: seed with default favorites
        localStorage.setItem(key, JSON.stringify(DEFAULT_INITIAL_FAVORITES));
        return DEFAULT_INITIAL_FAVORITES;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to read favorites from localStorage:', e);
      return DEFAULT_INITIAL_FAVORITES;
    }
  },

  isFavorite(courseId: string, userId?: string | null): boolean {
    const list = this.getFavorites(userId);
    return list.includes(courseId);
  },

  toggleFavorite(courseId: string, userId?: string | null): { isFavorite: boolean; favorites: string[] } {
    try {
      const key = this.getStorageKey(userId);
      const current = this.getFavorites(userId);
      const index = current.indexOf(courseId);
      let updated: string[];
      let isFav: boolean;

      if (index >= 0) {
        updated = current.filter((id) => id !== courseId);
        isFav = false;
      } else {
        updated = [...current, courseId];
        isFav = true;
      }

      localStorage.setItem(key, JSON.stringify(updated));

      // Dispatch custom window event so other tabs/components can listen
      window.dispatchEvent(
        new CustomEvent('coursue:favorite-changed', {
          detail: { courseId, isFavorite: isFav, favorites: updated },
        })
      );

      return { isFavorite: isFav, favorites: updated };
    } catch (e) {
      console.error('Failed to toggle favorite:', e);
      return { isFavorite: false, favorites: [] };
    }
  },
};

