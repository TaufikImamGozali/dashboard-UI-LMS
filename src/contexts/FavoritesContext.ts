import { createContext } from 'react';

export interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (courseId: string) => boolean;
  toggleFavorite: (courseId: string, courseTitle?: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

