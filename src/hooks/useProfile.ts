import { useContext } from 'react';
import { ProfileContext } from '../contexts/ProfileContext';

export const useProfile = () => {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside ProfileProvider');
  return value;
};
