import { useContext } from 'react';
import { FavoritesContext, type FavoritesContextValue } from '../contexts/FavoritesContext';

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

