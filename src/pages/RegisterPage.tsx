import React, { useState } from 'react';
import { User, Mail, AlertCircle, CheckCircle2, ExternalLink, RefreshCw } from 'lucide-react';
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

  const { signUp } = useAuth();

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
      <AuthLayout>
        <div className="space-y-6 text-left animate-scale-in">
          {/* Header icon & badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm border border-brand-500/20">
              <Mail className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Registrasi Berhasil
              </span>
              <h1 className="text-2xl font-black text-slateText-primary tracking-tight mt-1">
                Aktivasi Akun Anda ✉️
              </h1>
            </div>
          </div>

          {/* Target Email Box */}
          <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-900/40 space-y-2 text-sm text-slateText-secondary">
            <p>
              Tautan konfirmasi pendaftaran telah dikirimkan ke alamat email:
            </p>
            <div className="font-bold text-slateText-primary break-all bg-white dark:bg-darkCard px-3 py-2 rounded-xl border border-brand-100 dark:border-brand-900/60 text-brand-600 dark:text-brand-400">
              {confirmedEmailTarget}
            </div>
          </div>

          {/* Step by step guide */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slateText-muted">
              Langkah Selanjutnya:
            </p>
            <ol className="space-y-2.5 text-xs text-slateText-secondary">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                <span>Buka aplikasi Gmail atau inbox email Anda.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                <span>Temukan email dari <strong>Supabase Auth</strong> berjudul <em>&quot;Confirm your email address&quot;</em>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                <span>Klik tautan <strong>&quot;Confirm email address&quot;</strong> di dalam email tersebut untuk mengaktifkan akun.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">!</span>
                <span className="text-slateText-muted">Jika belum muncul di Kotak Masuk, periksa juga folder <strong>Spam</strong> atau <strong>Promosi</strong>.</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Buka Gmail Sekarang
            </a>

            <Button
              type="button"
              variant="outline"
              fullWidth
              size="md"
              className="rounded-full"
              onClick={() => navigate('/login')}
            >
              Sudah Konfirmasi? Masuk ke Akun
            </Button>
          </div>

          {/* Resend Action */}
          <div className="pt-2 text-center text-xs text-slateText-muted border-t border-slate-100 dark:border-darkBorder flex items-center justify-between">
            <span>Belum menerima email?</span>
            <button
              type="button"
              disabled={isResending}
              onClick={handleResendEmail}
              className="font-bold text-brand-500 hover:text-brand-600 disabled:opacity-50 inline-flex items-center gap-1 focus:outline-none cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
              {isResending ? 'Mengirim...' : 'Kirim Ulang'}
            </button>
          </div>
          {resendStatus === 'success' && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 text-center font-medium">
              ✓ Email konfirmasi baru berhasil dikirimkan ulang!
            </p>
          )}
          {resendStatus === 'error' && (
            <p className="text-[11px] text-rose-500 text-center font-medium">
              Gagal mengirim ulang email (mungkin terkena batas limit per jam). Cek folder spam Anda.
            </p>
          )}
        </div>
      </AuthLayout>
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
              className="rounded-full"
            >
              Create Account
            </Button>
          </div>
        </form>

        {/* Link back to login */}
        <p className="text-center text-xs text-slateText-secondary">
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
