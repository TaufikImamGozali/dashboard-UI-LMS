import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../hooks/useAuth';
import { ToastContainer, type ToastMessage } from '../components/ui/Toast';

export const FavoritesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => favoriteService.getFavorites());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const lastToggleRef = useRef<{ id: string; time: number } | null>(null);

  // Keep favorites in sync with local storage & user state
  useEffect(() => {
    const syncFavs = () => {
      setFavoriteIds(favoriteService.getFavorites());
    };

    window.addEventListener('coursue:favorite-changed', syncFavs);
    window.addEventListener('storage', syncFavs);

    return () => {
      window.removeEventListener('coursue:favorite-changed', syncFavs);
      window.removeEventListener('storage', syncFavs);
    };
  }, [isAuthenticated]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = `fav-toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const isFavorite = useCallback(
    (courseId: string) => favoriteIds.includes(courseId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (courseId: string, courseTitle?: string) => {
      const now = Date.now();
      if (
        lastToggleRef.current &&
        lastToggleRef.current.id === courseId &&
        now - lastToggleRef.current.time < 350
      ) {
        return favoriteIds.includes(courseId);
      }
      lastToggleRef.current = { id: courseId, time: now };

      const { isFavorite: nextIsFav, favorites } = favoriteService.toggleFavorite(courseId);
      setFavoriteIds(favorites);

      // Dismiss any existing favorite toast to avoid stacked notifications
      setToasts((prev) => prev.filter((t) => !t.id.startsWith('fav-toast-')));

      const titleSnippet = courseTitle ? `"${courseTitle}"` : 'Kursus';
      if (nextIsFav) {
        showToast(`❤️ ${titleSnippet} ditambahkan ke Favorit!`, 'success');
      } else {
        showToast(`Dihapus dari Favorit`, 'info');
      }

      return nextIsFav;
    },
    [showToast, favoriteIds]
  );

  const contextValue = useMemo(
    () => ({
      favoriteIds,
      isFavorite,
      toggleFavorite,
    }),
    [favoriteIds, isFavorite, toggleFavorite]
  );

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </FavoritesContext.Provider>
  );
};
