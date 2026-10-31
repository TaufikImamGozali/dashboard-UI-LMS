import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import type { CourseDetail } from '../../types';
import { formatPrice } from '../../utils/currency';
import { courseService } from '../../services/courseService';

interface CoursePaymentModalProps {
  isOpen: boolean;
  course: CourseDetail;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

type PaymentMethodType = 'qris' | 'va' | 'ewallet';

export const CoursePaymentModal: React.FC<CoursePaymentModalProps> = ({
  isOpen,
  course,
  onClose,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedVa, setCopiedVa] = useState(false);

  if (!isOpen) return null;

  const vaNumber = '8808 2490 8821 0019';

  const handleCopyVa = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s+/g, ''));
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      // Simulate network latency / payment confirmation
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const res = await courseService.enrollPaidCourse(course.id, selectedMethod);
      if (res.success) {
        setIsSuccess(true);
      }
    } catch (e) {
      console.error('Error during simulated payment:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishAndLearn = () => {
    onPaymentSuccess();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-surface rounded-3xl border border-outline shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-subtle bg-surface-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              👑
            </div>
            <div>
              <h2 id="payment-modal-title" className="text-base font-bold text-slateText-primary leading-tight">
                {isSuccess ? 'Pembayaran Berhasil 🎉' : 'Checkout Kelas Premium'}
              </h2>
              <p className="text-micro text-slateText-muted">
                {isSuccess ? 'Akses materi telah aktif sepenuhnya' : 'Konfirmasi pembayaran & dapatkan akses seumur hidup'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slateText-muted hover:text-slateText-primary hover:bg-surface transition-colors"
            aria-label="Tutup popup pembayaran"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-5 flex-1">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-5 animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="text-xl font-extrabold text-slateText-primary">
                  Selamat! Anda Telah Terdaftar
                </h3>
                <p className="text-xs text-slateText-muted leading-relaxed">
                  Pembayaran untuk kelas <span className="font-bold text-slateText-primary">"{course.title}"</span> telah berhasil diverifikasi. Seluruh {course.sections?.reduce((acc, s) => acc + s.lessons.length, 0) || 8} materi video kini terbuka tanpa batas!
                </p>
              </div>

              {/* Course badge receipt */}
              <div className="p-4 rounded-2xl bg-surface-muted border border-outline-subtle flex items-center gap-3.5 text-left max-w-sm mx-auto">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slateText-primary truncate">{course.title}</p>
                  <p className="text-micro text-slateText-muted mt-0.5">Oleh {course.mentor.name}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                    Akses Aktif Seumur Hidup
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinishAndLearn}
                  className="w-full max-w-sm py-3 px-6 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-purple-glow transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
                >
                  <span>Mulai Belajar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <>
              {/* Course Item Summary */}
              <div className="p-3.5 rounded-2xl bg-surface-muted border border-outline-subtle flex items-center gap-3.5">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {course.categoryLabel}
                    </span>
                    <span className="text-micro text-slateText-muted font-medium">
                      {course.level}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slateText-primary truncate">
                    {course.title}
                  </h4>
                  <p className="text-micro text-slateText-muted mt-0.5">
                    Mentor: {course.mentor.name}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-purple-700">
                    {formatPrice(course.price)}
                  </p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2.5">
                <p className="text-xs font-bold text-slateText-primary uppercase tracking-wider">
                  Pilih Metode Pembayaran
                </p>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* QRIS */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('qris')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethod === 'qris'
                        ? 'border-brand-500 bg-brand-50/70 text-brand-600 ring-2 ring-brand-200 shadow-xs'
                        : 'border-outline hover:border-slate-300 bg-surface text-slateText-secondary'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="text-xs font-bold">QRIS</span>
                    <span className="text-[10px] text-slateText-muted">Instant Scan</span>
                  </button>

                  {/* Virtual Account */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('va')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethod === 'va'
                        ? 'border-brand-500 bg-brand-50/70 text-brand-600 ring-2 ring-brand-200 shadow-xs'
                        : 'border-outline hover:border-slate-300 bg-surface text-slateText-secondary'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs font-bold">Virtual Account</span>
                    <span className="text-[10px] text-slateText-muted">BCA, Mandiri, BRI</span>
                  </button>

                  {/* E-Wallet */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('ewallet')}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedMethod === 'ewallet'
                        ? 'border-brand-500 bg-brand-50/70 text-brand-600 ring-2 ring-brand-200 shadow-xs'
                        : 'border-outline hover:border-slate-300 bg-surface text-slateText-secondary'
                    }`}
                  >
                    <Wallet className="w-5 h-5" />
                    <span className="text-xs font-bold">E-Wallet</span>
                    <span className="text-[10px] text-slateText-muted">GoPay, OVO, Dana</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Method View */}
              <div className="p-4 rounded-2xl bg-surface-subtle border border-outline-subtle">
                {selectedMethod === 'qris' && (
                  <div className="text-center space-y-3">
                    <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                      {/* Stylized QR simulation */}
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-900">
                        <rect width="100" height="100" fill="white" />
                        <rect x="10" y="10" width="24" height="24" rx="3" fill="#1e293b" />
                        <rect x="15" y="15" width="14" height="14" rx="2" fill="white" />
                        <rect x="19" y="19" width="6" height="6" fill="#1e293b" />
                        <rect x="66" y="10" width="24" height="24" rx="3" fill="#1e293b" />
                        <rect x="71" y="15" width="14" height="14" rx="2" fill="white" />
                        <rect x="75" y="19" width="6" height="6" fill="#1e293b" />
                        <rect x="10" y="66" width="24" height="24" rx="3" fill="#1e293b" />
                        <rect x="15" y="71" width="14" height="14" rx="2" fill="white" />
                        <rect x="19" y="75" width="6" height="6" fill="#1e293b" />
                        <rect x="42" y="18" width="6" height="12" fill="#1e293b" />
                        <rect x="42" y="38" width="16" height="6" fill="#6366f1" />
                        <rect x="42" y="52" width="16" height="16" rx="2" fill="#6366f1" />
                        <rect x="66" y="42" width="24" height="8" fill="#1e293b" />
                        <rect x="70" y="66" width="10" height="10" fill="#1e293b" />
                        <rect x="84" y="80" width="6" height="10" fill="#1e293b" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slateText-primary">
                        Scan via BCA Mobile, GoPay, OVO, ShopeePay, atau DANA
                      </p>
                      <p className="text-micro text-slateText-muted">
                        Merchant: Coursue LMS Official • Verifikasi Instan
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'va' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slateText-primary">
                      <span>BCA / Mandiri / BRI Virtual Account</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Otomatis Verifikasi
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-outline">
                      <span className="font-mono font-bold text-sm text-slateText-primary tracking-wider">
                        {vaNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyVa}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600"
                      >
                        {copiedVa ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin No. VA</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-micro text-slateText-muted">
                      Transfer melalui ATM, Internet Banking, atau Mobile Banking ke nomor Virtual Account di atas.
                    </p>
                  </div>
                )}

                {selectedMethod === 'ewallet' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slateText-primary">
                      <span>Nomor Handphone Terdaftar</span>
                    </div>
                    <input
                      type="tel"
                      defaultValue="0812-3456-7890"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-outline bg-surface text-xs font-bold text-slateText-primary focus:outline-none focus:ring-2 focus:ring-brand-200"
                      placeholder="Masukkan no handphone e-wallet"
                    />
                    <p className="text-micro text-slateText-muted">
                      Notifikasi konfirmasi pembayaran akan otomatis dikirimkan ke aplikasi E-Wallet Anda.
                    </p>
                  </div>
                )}
              </div>

              {/* Price Details Breakdown */}
              <div className="space-y-2 pt-2 border-t border-outline-subtle text-xs">
                <div className="flex justify-between text-slateText-secondary">
                  <span>Harga Normal</span>
                  <span className="line-through text-slateText-muted">
                    {course.price && course.price > 1000
                      ? `Rp ${(course.price + 100000).toLocaleString('id-ID')}`
                      : `$${(course.price || 0) + 15}`}
                  </span>
                </div>
                <div className="flex justify-between text-slateText-secondary">
                  <span>Diskon Promo Spesial</span>
                  <span className="text-emerald-600 font-bold">
                    {course.price && course.price > 1000 ? '-Rp 100.000' : '-$15'}
                  </span>
                </div>
                <div className="flex justify-between text-slateText-secondary">
                  <span>Biaya Layanan & PPN</span>
                  <span className="text-slateText-muted font-semibold">Gratis (Rp 0)</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slateText-primary pt-2 border-t border-outline-subtle">
                  <span>Total Pembayaran</span>
                  <span className="text-brand-600 text-base">
                    {formatPrice(course.price)}
                  </span>
                </div>
              </div>

              {/* Security & Guarantee note */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-[11px] font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Garansi 100% Pembayaran Aman & Akses Langsung Aktif</span>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!isSuccess && (
          <div className="p-4 sm:px-6 bg-surface-subtle border-t border-outline-subtle flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-full border border-outline hover:bg-surface text-slateText-secondary font-bold text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="flex-1 py-3 px-5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm shadow-purple-glow transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses Pembayaran...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Bayar Sekarang ({formatPrice(course.price)})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
