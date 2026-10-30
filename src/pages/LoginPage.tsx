import React, { useEffect, useState } from 'react';
import { Mail, Shield, User, Sparkles, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { PasswordField } from '../components/ui/PasswordField';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const { toasts, showToast, dismissToast } = useToast();

  const isGoogleLoginEnabled = import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true';
  const isDev = import.meta.env.DEV;

  useEffect(() => {
    const message = sessionStorage.getItem('coursue_flash');
    if (message) {
      sessionStorage.removeItem('coursue_flash');
      showToast(message, 'success');
    }
  }, [showToast]);

  const [email, setEmail] = useState(() => authService.getRememberedEmail());
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => Boolean(authService.getRememberedEmail()));
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin'>('student');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick preset helper - only available in development
  const handleSelectPreset = (role: 'student' | 'admin') => {
    if (!import.meta.env.DEV) return;
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@coursue.com');
      setPassword('password123');
    } else {
      setEmail('user@coursue.com');
      setPassword('password123');
    }
    setEmailError('');
    setPasswordError('');
    setAuthError('');
  };

  const validate = (): boolean => {
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation: min 8 characters
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setAuthError('');

    try {
      const res = await signIn(email, password, rememberMe);
      setIsLoading(false);

      if (!res.success) {
        const errorMsg =
          res.error === 'Invalid login credentials'
            ? 'Email atau kata sandi salah. Silakan periksa kembali akun Anda.'
            : res.error || 'Login gagal. Periksa kembali email dan kata sandi Anda.';
        setAuthError(errorMsg);
        showToast(errorMsg, 'error');
        return;
      }

      if (res.role === 'admin') {
        showToast('Logged in as Platform Administrator', 'success');
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch {
      setIsLoading(false);
      setAuthError('Gagal menghubungkan ke server autentikasi.');
      showToast('Gagal menghubungkan ke server', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setIsLoading(false);
        const errorMsg = res.error || 'Gagal memulai login dengan Google.';
        setAuthError(errorMsg);
        showToast(errorMsg, 'error');
      }
      // If success, user will be redirected by Supabase to Google sign-in page
    } catch {
      setIsLoading(false);
      setAuthError('Gagal menghubungkan ke Google OAuth.');
      showToast('Gagal menghubungkan ke Google', 'error');
    }
  };

  return (
    <>
      <AuthLayout>
        <div className="space-y-6">
          {/* Heading */}
          <div className="space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight">
              Welcome Back <span role="img" aria-label="waving hand">👋</span>
            </h1>
            <p className="text-sm text-slateText-secondary">
              Login to continue your learning journey
            </p>
          </div>

          {/* Real-time Auth Error Banner */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-scale-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Gagal Masuk</p>
                <p className="text-rose-600 mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          {/* Quick Demo Role Selector - Dev Only */}
          {isDev && (
            <div className="p-3.5 rounded-2xl bg-surface border border-outline shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-meta font-extrabold text-content-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  Quick Demo Login (Dev Only)
                </span>
                <span className="text-meta font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  1-Click Preset
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('student')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'student' && email === 'user@coursue.com'
                      ? 'bg-brand-500 text-white shadow-purple-glow'
                      : 'bg-surface-muted hover:bg-slate-200/60 text-content-secondary'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPreset('admin')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    selectedRole === 'admin' && email === 'admin@coursue.com'
                      ? 'bg-purple-600 text-white shadow-purple-glow'
                      : 'bg-surface-muted hover:bg-purple-100/60 text-purple-700'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email field */}
            <TextField
              id="login-email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
                if (authError) setAuthError('');
                if (e.target.value.toLowerCase().includes('admin@')) {
                  setSelectedRole('admin');
                }
              }}
              error={emailError}
              leftIcon={<Mail className="w-4 h-4 stroke-[2]" />}
              required
              autoComplete="email"
            />

            {/* Password field */}
            <PasswordField
              id="login-password"
              name="password"
              label="Password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
                if (authError) setAuthError('');
              }}
              error={passwordError}
              required
              autoComplete="current-password"
            />

            {/* Remember me & Forgot Password row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slateText-secondary hover:text-slateText-primary">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-500 focus:ring-brand-200 border-slate-300 accent-brand-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-brand-500 hover:text-brand-600 transition-colors focus:outline-none focus-visible:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="md"
                isLoading={isLoading}
                className="rounded-full"
              >
                {selectedRole === 'admin' || email.includes('admin@')
                  ? 'Login to Admin Console'
                  : 'Login'}
              </Button>
            </div>
          </form>

          {/* Social Google Login Button - conditionally rendered based on VITE_ENABLE_GOOGLE_LOGIN */}
          {isGoogleLoginEnabled && (
            <>
              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-surface px-3 text-xs uppercase tracking-wider text-slateText-muted font-medium shrink-0">
                  or continue with
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              <Button
                type="button"
                variant="outline"
                fullWidth
                size="md"
                disabled={isLoading}
                onClick={handleGoogleLogin}
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="var(--google-blue)"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="var(--google-green)"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="var(--google-yellow)"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="var(--google-red)"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                }
                className="rounded-full text-slateText-primary"
              >
                Continue with Google
              </Button>
            </>
          )}

          {/* Bottom register link */}
          <p className="text-center text-xs text-slateText-secondary">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-brand-500 hover:text-brand-600 transition-colors focus:outline-none focus-visible:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </AuthLayout>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};
