import React, { useState } from 'react';
import { User, Mail, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { PasswordField } from '../components/ui/PasswordField';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

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
  const { signUp } = useAuth();

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
        } else if (lower.includes('already registered')) {
          errMessage = 'Email ini sudah terdaftar. Silakan langsung login atau gunakan email lain.';
        }
        setAuthError(errMessage);
        return;
      }

      if (res.emailConfirmationRequired) {
        sessionStorage.setItem(
          'coursue_flash',
          `Akun untuk ${email} berhasil dibuat! Silakan cek email Anda untuk verifikasi, atau login dengan kata sandi Anda.`
        );
        navigate('/login', { replace: true });
        return;
      }

      sessionStorage.setItem('coursue_flash', `Selamat datang, ${fullName.trim()}! Akun Anda telah aktif.`);
      navigate('/', { replace: true });
    } catch {
      setIsLoading(false);
      setAuthError('Gagal menghubungkan ke server pendaftaran.');
    }
  };

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
