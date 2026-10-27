import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { Button } from '../components/ui/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
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
            <span>Back to Login</span>
          </Link>
        </div>

        {isSubmitted ? (
          /* Success confirmation state */
          <div className="text-center space-y-4 py-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-slateText-primary tracking-tight">
                Check Your Inbox
              </h2>
              <p className="text-sm text-slateText-secondary max-w-sm mx-auto leading-relaxed">
                We've sent password reset instructions to{' '}
                <span className="font-semibold text-slateText-primary">{email}</span>.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/login">
                <Button variant="primary" fullWidth size="md" className="rounded-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Reset form */
          <>
            <div className="space-y-1.5 text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight">
                Forgot Password? 🔑
              </h1>
              <p className="text-sm text-slateText-secondary">
                No worries, enter your email and we'll send you recovery instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <TextField
                id="reset-email"
                name="email"
                type="email"
                label="Registered Email"
                placeholder="jason.ranti@example.com"
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

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="md"
                  isLoading={isLoading}
                  className="rounded-full"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
};
