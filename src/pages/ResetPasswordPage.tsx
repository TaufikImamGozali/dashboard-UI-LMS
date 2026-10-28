import React, { useEffect, useMemo, useState } from 'react';
import { Lock, AlertCircle, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { PasswordField } from '../components/ui/PasswordField';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';

type SessionStatus = 'checking' | 'valid' | 'invalid' | 'success';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // Derive initial status synchronously from URL parameters if Supabase returned an error
  const initialUrlState = useMemo(() => {
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(window.location.search);

    const errorDesc = hashParams.get('error_description') || searchParams.get('error_description');
    const errorCode = hashParams.get('error_code') || searchParams.get('error_code');

    if (errorCode || errorDesc) {
      return {
        status: 'invalid' as SessionStatus,
        error: errorDesc
          ? decodeURIComponent(errorDesc).replace(/\+/g, ' ')
          : 'Tautan reset kata sandi tidak valid atau telah kedaluwarsa.',
      };
    }

    return { status: 'checking' as SessionStatus, error: '' };
  }, []);

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>(initialUrlState.status);
  const [errorMessage, setErrorMessage] = useState(initialUrlState.error);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If URL already had an error code, no need to listen or poll
    if (initialUrlState.status === 'invalid') {
      return;
    }

    // 1. Listen to Supabase Auth state changes for PASSWORD_RECOVERY
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setSessionStatus('valid');
      }
    });

    // 2. Check existing session from client
    authService.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionStatus('valid');
      }
    });

    // 3. Fallback: if no recovery tokens or session resolved within 2.5s, mark as invalid
    const timer = setTimeout(() => {
      setSessionStatus((prev) => {
        if (prev === 'checking') {
          setErrorMessage('Tautan reset kata sandi tidak ditemukan atau sudah kedaluwarsa.');
          return 'invalid';
        }
        return prev;
      });
    }, 2500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [initialUrlState.status]);

  const validate = (): boolean => {
    let isValid = true;

    if (!password) {
      setPasswordError('Password baru wajib diisi');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password minimal 8 karakter');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword) {
      setConfirmError('Konfirmasi password wajib diisi');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmError('Konfirmasi password tidak cocok');
      isValid = false;
    } else {
      setConfirmError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const res = await authService.updatePassword(password);
      setIsLoading(false);

      if (!res.success) {
        setSubmitError(res.error || 'Gagal memperbarui password. Silakan coba kembali.');
        return;
      }

      setSessionStatus('success');

      // Logout temporary recovery session to ensure fresh login
      await authService.logout();

      // Redirect to login with flash notification after a short delay
      setTimeout(() => {
        sessionStorage.setItem(
          'coursue_flash',
          'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.'
        );
        navigate('/login', { replace: true });
      }, 2000);
    } catch {
      setIsLoading(false);
      setSubmitError('Terjadi kesalahan saat menghubungi server.');
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

        {/* State 1: Checking session */}
        {sessionStatus === 'checking' && (
          <div className="text-center py-10 space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-6 h-6 stroke-[2]" />
            </div>
            <p className="text-sm font-medium text-slateText-secondary">
              Memverifikasi tautan reset kata sandi...
            </p>
          </div>
        )}

        {/* State 2: Invalid or expired link */}
        {sessionStatus === 'invalid' && (
          <div className="text-center space-y-4 py-4 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
              <AlertCircle className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slateText-primary tracking-tight">
                Tautan Tidak Valid atau Kedaluwarsa
              </h2>
              <p className="text-sm text-slateText-secondary max-w-sm mx-auto leading-relaxed">
                {errorMessage ||
                  'Tautan reset kata sandi sudah kedaluwarsa atau pernah digunakan sebelumnya. Silakan ajukan permintaan baru.'}
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Link to="/forgot-password" className="block">
                <Button variant="primary" fullWidth size="md" className="rounded-full">
                  Minta Link Reset Baru
                </Button>
              </Link>
              <Link to="/login" className="block">
                <Button variant="outline" fullWidth size="md" className="rounded-full">
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Password updated successfully */}
        {sessionStatus === 'success' && (
          <div className="text-center space-y-4 py-4 animate-scale-in">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slateText-primary tracking-tight">
                Kata Sandi Berhasil Diperbarui! 🎉
              </h2>
              <p className="text-sm text-slateText-secondary max-w-sm mx-auto leading-relaxed">
                Kata sandi baru Anda telah aktif. Mengalihkan Anda ke halaman login...
              </p>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                fullWidth
                size="md"
                className="rounded-full"
                onClick={() => {
                  sessionStorage.setItem(
                    'coursue_flash',
                    'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.'
                  );
                  navigate('/login', { replace: true });
                }}
              >
                Masuk Sekarang
              </Button>
            </div>
          </div>
        )}

        {/* State 4: Valid recovery session form */}
        {sessionStatus === 'valid' && (
          <>
            <div className="space-y-1.5 text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight">
                Kata Sandi Baru 🔐
              </h1>
              <p className="text-sm text-slateText-secondary">
                Buat kata sandi baru yang aman untuk akun Anda (minimal 8 karakter).
              </p>
            </div>

            {/* Error banner */}
            {submitError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-scale-in">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Gagal Menyimpan</p>
                  <p className="text-rose-600 mt-0.5">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <PasswordField
                id="new-password"
                name="newPassword"
                label="Kata Sandi Baru"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                  if (submitError) setSubmitError('');
                }}
                error={passwordError}
                required
                autoComplete="new-password"
              />

              <PasswordField
                id="confirm-password"
                name="confirmPassword"
                label="Konfirmasi Kata Sandi"
                placeholder="Ulangi kata sandi baru"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmError) setConfirmError('');
                  if (submitError) setSubmitError('');
                }}
                error={confirmError}
                required
                autoComplete="new-password"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="md"
                  isLoading={isLoading}
                  leftIcon={<Lock className="w-4 h-4" />}
                  className="rounded-full"
                >
                  Simpan Kata Sandi Baru
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

