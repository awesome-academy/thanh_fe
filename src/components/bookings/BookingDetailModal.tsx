'use client';

import { useEffect } from 'react';
import { Booking } from '@/types';
import { formatCurrency } from '@/lib/format';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { X, MapPin, Calendar, Users, CreditCard, Phone, Mail, FileText, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Đang chờ xác nhận', className: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Đã hủy', className: 'bg-rose-100 text-rose-600' },
} as const;

const PAYMENT_LABELS: Record<string, string> = {
  momo: 'MoMo',
  vnpay: 'VNPay',
  transfer: 'Chuyển khoản',
  card: 'Thẻ tín dụng',
};

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onCancelClick: () => void;
}

export default function BookingDetailModal({ booking, onClose, onCancelClick }: BookingDetailModalProps) {
  const status = STATUS_CONFIG[booking.status];
  const modalRef = useFocusTrap<HTMLDivElement>();

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-detail-title"
        className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-borderSubtle">
          <div>
            <h2 id="booking-detail-title" className="text-base font-bold text-textStrong">
              Chi tiết đơn hàng
            </h2>
            <p className="text-xs text-textMuted font-mono">{booking.code}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-textSubtle hover:text-textStrong hover:bg-borderSubtle transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Status */}
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>

          {/* Tour Info */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-textMuted uppercase tracking-widest">Tour</p>
            <p className="font-bold text-textStrong">{booking.tourName}</p>
            <p className="text-sm text-textSubtle flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cacao-500" />
              {booking.tourDest}
            </p>
            <p className="text-sm text-textSubtle flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cacao-500" />
              Khởi hành: {new Date(booking.departDate).toLocaleDateString('vi-VN')}
            </p>
          </div>

          {/* Guests */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-textMuted uppercase tracking-widest">Hành khách</p>
            <p className="text-sm text-textSubtle flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cacao-500" />
              {booking.adults} người lớn{booking.children > 0 ? ` · ${booking.children} trẻ em` : ''}
            </p>
          </div>

          {/* Payment */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-textMuted uppercase tracking-widest">Thanh toán</p>
            <p className="text-sm text-textSubtle flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-cacao-500" />
              {PAYMENT_LABELS[booking.paymentMethod] ?? booking.paymentMethod}
            </p>
            <p className="text-xl font-extrabold text-cacao-600">{formatCurrency(booking.totalPrice)}</p>
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-textMuted uppercase tracking-widest">Liên hệ</p>
            <p className="text-sm font-medium text-textStrong">{booking.contact.fullName}</p>
            <p className="text-sm text-textSubtle flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-cacao-500" />
              {booking.contact.email}
            </p>
            <p className="text-sm text-textSubtle flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-cacao-500" />
              {booking.contact.phone}
            </p>
            {booking.contact.note && (
              <p className="text-sm text-textSubtle flex items-start gap-1">
                <FileText className="w-3.5 h-3.5 text-cacao-500 mt-0.5 shrink-0" />
                {booking.contact.note}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-borderSubtle flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-textSubtle hover:text-textStrong border border-borderSubtle rounded-xl transition-colors"
          >
            Đóng
          </button>
          {booking.status === 'pending' && (
            <button
              type="button"
              onClick={onCancelClick}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Hủy đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
