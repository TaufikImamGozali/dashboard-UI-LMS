import React, { useState } from 'react';
import { User, Mail, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { PasswordField } from '../components/ui/PasswordField';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    let isValid = true;

    if (!fullName.trim()) {
      setNameError('Full name is required');
      isValid = false;
    } else {
      setNameError('');
    }

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

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!agreeTerms) {
      setTermsError('You must agree to the Terms of Service');
      isValid = false;
    } else {
      setTermsError('');
    }

    return isValid;
  };

  const [authError, setAuthError] = useState('');
  const [showConfirmationNotice, setShowConfirmationNotice] = useState(false);
  const [confirmedEmailTarget, setConfirmedEmailTarget] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { signUp, signInWithGoogle } = useAuth();

  const handleResendEmail = async () => {
    if (!confirmedEmailTarget || isResending) return;
    setIsResending(true);
    setResendStatus('idle');
    try {
      const res = await authService.resendConfirmationEmail(confirmedEmailTarget);
      if (res.success) {
        setResendStatus('success');
      } else {
        setResendStatus('error');
      }
    } catch {
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setIsLoading(false);
        const errorMsg = res.error || 'Gagal memulai registrasi dengan Google.';
        setAuthError(errorMsg);
      }
    } catch {
      setIsLoading(false);
      setAuthError('Gagal menghubungkan ke Google OAuth.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setAuthError('');

    try {
      const res = await signUp(fullName, email, password);
      setIsLoading(false);

      if (!res.success) {
        let errMessage = res.error || 'Pendaftaran gagal. Periksa kembali informasi Anda.';
        const lower = errMessage.toLowerCase();
        if (lower.includes('rate limit') || lower.includes('email rate limit exceeded')) {
          errMessage =
            'Batas pengiriman email Supabase terlampaui (maksimal 3-4 email per jam pada server gratis bawaan Supabase). Untuk kelancaran pengembangan/testing, matikan opsi "Confirm email" di Supabase Dashboard (Authentication > Providers > Email) agar registrasi instan tanpa limit email.';
        } else if (lower.includes('is invalid') || (lower.includes('invalid') && lower.includes('email'))) {
          errMessage =
            'Alamat email ditolak oleh server Supabase (terdeteksi sebagai email fiktif/tidak dapat menerima email). Gunakan email asli Anda, atau matikan opsi "Confirm email" di Supabase Dashboard (Authentication > Providers > Email) agar bisa mendaftar bebas tanpa verifikasi email.';
        } else if (lower.includes('already registered')) {
          errMessage = 'Email ini sudah terdaftar. Silakan langsung login atau gunakan email lain.';
        }
        setAuthError(errMessage);
        return;
      }

      if (res.emailConfirmationRequired) {
        setConfirmedEmailTarget(email.trim().toLowerCase());
        setShowConfirmationNotice(true);
        return;
      }

      sessionStorage.setItem('coursue_flash', `Selamat datang, ${fullName.trim()}! Akun Anda telah aktif.`);
      navigate('/dashboard', { replace: true });
    } catch {
      setIsLoading(false);
      setAuthError('Gagal menghubungkan ke server pendaftaran.');
    }
  };

  if (showConfirmationNotice) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="w-full max-w-[440px] bg-surface rounded-3xl sm:rounded-[28px] p-6 sm:p-8 md:p-9 shadow-container border border-outline animate-scale-in text-center">
          {/* Logo Header */}
          <div className="flex justify-center mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-purple-glow text-white group-hover:scale-105 transition-transform">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white stroke-none">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slateText-primary font-sans">
                Coursue
              </span>
            </Link>
          </div>

          {/* Envelope with Radiating Accent Rays Illustration */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-50/80 dark:bg-brand-950/40 border border-brand-100/80 dark:border-brand-900/40 flex items-center justify-center mb-6">
            <div className="relative">
              {/* Folded Envelope Graphic */}
              <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/25 text-white relative overflow-hidden">
                <svg viewBox="0 0 64 44" className="w-full h-full fill-none">
                  <path
                    d="M2 2 L32 24 L62 2"
                    fill="white"
                    fillOpacity="0.32"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <path d="M2 42 L24 20" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
                  <path d="M62 42 L40 20" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
                </svg>
              </div>

              {/* 3 Radiating accent rays at top right */}
              <div className="absolute -top-2.5 -right-2.5 text-brand-500 dark:text-brand-400">
                <svg className="w-5 h-5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 20 20">
                  <path d="M6 11L2 13" strokeLinecap="round" />
                  <path d="M11 6L12 2" strokeLinecap="round" />
                  <path d="M15 10L19 7" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slateText-primary tracking-tight">
            Aktivasi Akun Anda
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm text-slateText-secondary max-w-xs mx-auto leading-relaxed mt-2.5">
            Tautan konfirmasi pendaftaran telah dikirimkan ke alamat email berikut:
          </p>

          {/* Target Email Box */}
          <div className="mt-5 mb-5 py-3 px-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-100/70 dark:border-brand-900/40 flex items-center justify-center gap-2.5 text-slateText-primary">
            <Mail className="w-4 h-4 text-brand-500 shrink-0 stroke-[2.2]" />
            <span className="font-bold text-xs sm:text-sm break-all text-slateText-primary">
              {confirmedEmailTarget}
            </span>
          </div>

          {/* Primary Action Button */}
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 stroke-[2.2]" />
            <span>Buka Gmail Sekarang</span>
          </a>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-slate-200/80 dark:border-darkBorder"></div>
            <span className="absolute bg-surface px-3 text-xs text-slateText-muted font-medium">
              atau
            </span>
          </div>

          {/* Secondary Action Button */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full py-3.5 px-6 rounded-2xl border border-slate-200 dark:border-darkBorder bg-surface hover:bg-slate-50 dark:hover:bg-darkBorder/40 text-slateText-primary font-bold text-sm transition-all focus:outline-none cursor-pointer"
          >
            Sudah Konfirmasi? Masuk ke Akun
          </button>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between text-xs text-slateText-muted pt-5 mt-2 border-t border-slate-100 dark:border-darkBorder/60">
            <span>Belum menerima email?</span>
            <button
              type="button"
              disabled={isResending}
              onClick={handleResendEmail}
              className="font-bold text-brand-500 hover:text-brand-600 disabled:opacity-50 inline-flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Mengirim...' : 'Kirim Ulang'}</span>
            </button>
          </div>

          {/* Resend Status Feedback */}
          {resendStatus === 'success' && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 text-center font-medium mt-2 animate-fade-in">
              ✓ Email konfirmasi baru berhasil dikirimkan ulang!
            </p>
          )}
          {resendStatus === 'error' && (
            <p className="text-[11px] text-rose-500 text-center font-medium mt-2 animate-fade-in">
              Gagal mengirim ulang email (mungkin terkena batas limit per jam). Cek folder spam Anda.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Heading */}
        <div className="space-y-1.5 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight">
            Create an Account 🚀
          </h1>
          <p className="text-sm text-slateText-secondary">
            Join thousands of learners sharpening their skills today
          </p>
        </div>

        {/* Real-time Auth Error Banner */}
        {authError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-scale-in">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Gagal Mendaftar</p>
              <p className="text-rose-600 mt-0.5">{authError}</p>
            </div>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <TextField
            id="register-name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="e.g. Alex Johnson"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (nameError) setNameError('');
            }}
            error={nameError}
            leftIcon={<User className="w-4 h-4 stroke-[2]" />}
            required
            autoComplete="name"
          />

          <TextField
            id="register-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="alex.johnson@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            error={emailError}
            leftIcon={<Mail className="w-4 h-4 stroke-[2]" />}
            required
            autoComplete="email"
          />

          <PasswordField
            id="register-password"
            name="password"
            label="Create Password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError('');
            }}
            error={passwordError}
            required
            autoComplete="new-password"
          />

          {/* Terms checkbox */}
          <div className="space-y-1 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slateText-secondary">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (termsError) setTermsError('');
                }}
                className="mt-0.5 w-4 h-4 rounded text-brand-500 focus:ring-brand-200 border-slate-300 accent-brand-500 cursor-pointer"
              />
              <span>
                I agree to the{' '}
                <a href="#terms" className="text-brand-500 font-semibold underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-brand-500 font-semibold underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {termsError && (
              <p className="text-xs text-rose-500 font-medium pl-6">
                {termsError}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="md"
              isLoading={isLoading}
              className="rounded-full font-bold"
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Social Google Login Button */}
        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 dark:border-darkBorder w-full" />
          <span className="bg-surface px-3 text-xs uppercase tracking-wider text-slateText-muted font-medium shrink-0">
            or continue with
          </span>
          <div className="border-t border-slate-200 dark:border-darkBorder w-full" />
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
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          }
          className="rounded-full text-slateText-primary hover:bg-surface-muted transition-colors font-medium border-slate-200 dark:border-darkBorder"
        >
          Continue with Google
        </Button>

        {/* Link back to login */}
        <p className="text-center text-xs text-slateText-secondary pt-1">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-brand-500 hover:text-brand-600 transition-colors focus:outline-none focus-visible:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
