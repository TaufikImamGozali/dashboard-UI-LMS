const AUTH_KEY = 'coursue_auth';
const REMEMBER_KEY = 'coursue_remember';

export const authService = {
  isAuthenticated: () => localStorage.getItem(AUTH_KEY) === 'true',
  login: (remember = false) => {
    localStorage.setItem(AUTH_KEY, 'true');
    if (remember) localStorage.setItem(REMEMBER_KEY, 'true');
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  },
};
