import { createContext } from 'react';

export interface AuthContextValue { isAuthenticated: boolean; login: (remember?: boolean) => void; logout: () => void }
export const AuthContext = createContext<AuthContextValue | null>(null);
