import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    setGeneralError('');
    setIsLoading(true);

    try {
      const res = await authService.resetPasswordForEmail(email);

      setIsLoading(false);

      // Handle severe rate limit or network errors
      if (!res.success && res.error && (res.error.toLowerCase().includes('rate limit') || res.error.toLowerCase().includes('too many requests'))) {
        setGeneralError('Terlalu banyak permintaan reset kata sandi. Silakan tunggu beberapa saat lagi.');
        return;
      }

      // Display neutral success message to prevent user enumeration
      setIsSubmitted(true);
    } catch {
      setIsLoading(false);
      // Still show neutral confirmation unless it's a connection failure
      setGeneralError('Gagal menghubungkan ke server. Silakan periksa koneksi internet Anda.');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Back Link */}
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slateText-muted hover:text-brand-500 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Login</span>
          </Link>
        </div>

        {isSubmitted ? (
          /* Neutral Success Confirmation */
          <div className="text-center space-y-4 py-4 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slateText-primary tracking-tight">
                Periksa Email Anda
              </h2>
              <p className="text-sm text-slateText-secondary max-w-sm mx-auto leading-relaxed">
                Jika email <span className="font-semibold text-slateText-primary">{email}</span> terdaftar di Coursue, link reset kata sandi sudah dikirim.
              </p>
              <p className="text-xs text-slateText-muted max-w-xs mx-auto">
                Silakan periksa kotak masuk atau folder spam Anda dalam beberapa menit ke depan.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/login">
                <Button variant="primary" fullWidth size="md" className="rounded-full">
                  Kembali ke Halaman Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Reset form */
          <>
            <div className="space-y-1.5 text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight">
                Lupa Password? 🔑
              </h1>
              <p className="text-sm text-slateText-secondary">
                Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
              </p>
            </div>

            {/* General Error Banner */}
            {generalError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-scale-in">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Gagal Mengirim Link</p>
                  <p className="text-rose-600 mt-0.5">{generalError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <TextField
                id="reset-email"
                name="email"
                type="email"
                label="Email Terdaftar"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                  if (generalError) setGeneralError('');
                }}
                error={emailError}
                leftIcon={<Mail className="w-4 h-4 stroke-[2]" />}
                required
                autoComplete="email"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="md"
                  isLoading={isLoading}
                  className="rounded-full"
                >
                  Kirim Link Reset
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
