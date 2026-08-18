'use client';

import { useState, useEffect } from 'react';
import { Booking } from '@/types';
import { useCancelBooking } from '@/hooks/use-bookings';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

const CANCEL_REASONS = [
  'Có sự cố bất ngờ không thể tham gia',
  'Đổi lịch trình du lịch',
  'Tìm được tour phù hợp hơn',
  'Khác',
] as const;

interface CancelBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CancelBookingModal({ booking, onClose, onSuccess }: CancelBookingModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [formError, setFormError] = useState('');

  const { mutate: cancelBooking, isPending } = useCancelBooking();
  const modalRef = useFocusTrap<HTMLDivElement>();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, isPending]);

  const finalReason = selectedReason === 'Khác' ? customReason.trim() : selectedReason;

  const handleConfirm = () => {
    setFormError('');
    if (!selectedReason) {
      setFormError('Vui lòng chọn lý do hủy đơn.');
      return;
    }
    if (selectedReason === 'Khác' && !customReason.trim()) {
      setFormError('Vui lòng nhập lý do cụ thể.');
      return;
    }
    cancelBooking(
      { id: booking.id, reason: finalReason },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (err) => {
          setFormError(err.message || 'Hủy đơn thất bại, vui lòng thử lại.');
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget && !isPending) onClose(); }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-borderSubtle">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h2 id="cancel-modal-title" className="text-base font-bold text-textStrong">
              Xác nhận hủy đơn
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg text-textSubtle hover:text-textStrong hover:bg-borderSubtle transition-colors disabled:opacity-40"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-textBody">
            Bạn đang hủy đơn <span className="font-bold text-textStrong">{booking.code}</span> —{' '}
            {booking.tourName}. Hành động này không thể hoàn tác.
          </p>

          {/* Reason selection */}
          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-2">
              Lý do hủy
            </legend>
            {CANCEL_REASONS.map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-borderSubtle hover:border-cacao-500 cursor-pointer transition-colors has-[:checked]:border-cacao-500 has-[:checked]:bg-cacao-50"
              >
                <input
                  type="radio"
                  name="cancel-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => { setSelectedReason(reason); setFormError(''); }}
                  className="accent-cacao-600"
                />
                <span className="text-sm text-textBody">{reason}</span>
              </label>
            ))}
          </fieldset>

          {/* Custom reason textarea */}
          {selectedReason === 'Khác' && (
            <textarea
              placeholder="Nhập lý do của bạn..."
              value={customReason}
              onChange={(e) => { setCustomReason(e.target.value); setFormError(''); }}
              rows={3}
              className="w-full text-sm border border-borderSubtle rounded-xl px-3 py-2 text-textBody focus:outline-none focus:ring-2 focus:ring-cacao-500 resize-none"
            />
          )}

          {/* Form error */}
          {formError && (
            <p className="text-xs text-rose-600 font-medium">{formError}</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-borderSubtle flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-textSubtle hover:text-textStrong border border-borderSubtle rounded-xl transition-colors disabled:opacity-40"
          >
            Giữ đơn
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-70"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang hủy...
              </>
            ) : (
              'Xác nhận hủy'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
