'use client';

import { Booking } from '@/types';
import { formatCurrency } from '@/lib/format';
import { Calendar, Users, CreditCard, Eye, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    label: 'Đang chờ xác nhận',
    className: 'bg-amber-100 text-amber-700',
  },
  confirmed: {
    label: 'Đã xác nhận',
    className: 'bg-emerald-100 text-emerald-700',
  },
  cancelled: {
    label: 'Đã hủy',
    className: 'bg-rose-100 text-rose-600',
  },
} as const;

const PAYMENT_LABELS: Record<string, string> = {
  momo: 'MoMo',
  vnpay: 'VNPay',
  transfer: 'Chuyển khoản',
  card: 'Thẻ tín dụng',
};

interface BookingCardProps {
  booking: Booking;
  onViewDetail: () => void;
  onCancel: () => void;
}

export default function BookingCard({ booking, onViewDetail, onCancel }: BookingCardProps) {
  const status = STATUS_CONFIG[booking.status];
  const guestSummary = [
    booking.adults > 0 ? `${booking.adults} người lớn` : null,
    booking.children > 0 ? `${booking.children} trẻ em` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="bg-surface-card border border-borderSubtle rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${status.className}`}
        >
          {status.label}
        </span>
        <div className="text-right">
          <p className="text-xs text-textMuted">Mã đơn</p>
          <p className="text-sm font-bold text-textStrong font-mono">{booking.code}</p>
        </div>
      </div>

      {/* Tour info */}
      <div>
        <h3 className="font-bold text-textStrong text-base line-clamp-1">{booking.tourName}</h3>
        <p className="text-xs text-textMuted mt-0.5">{booking.tourDest}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-textSubtle">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-cacao-500" />
          {new Date(booking.departDate).toLocaleDateString('vi-VN')}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-cacao-500" />
          {guestSummary}
        </span>
        <span className="flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5 text-cacao-500" />
          {PAYMENT_LABELS[booking.paymentMethod] ?? booking.paymentMethod}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-borderSubtle gap-3 flex-wrap">
        <span className="text-base font-extrabold text-cacao-600">
          {formatCurrency(booking.totalPrice)}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onViewDetail}
            className="flex items-center gap-1.5 text-xs font-semibold text-cacao-600 hover:text-cacao-700 border border-cacao-500 hover:border-cacao-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Chi tiết
          </button>
          {booking.status === 'pending' && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 border border-rose-300 hover:border-rose-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Hủy đơn
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
