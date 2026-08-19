'use client';

import { useEffect, useState } from 'react';
import { Tour } from '@/types';
import { useDeleteTour } from '@/hooks/use-admin-tours';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteTourDialogProps {
  tour: Tour;
  onClose: () => void;
}

export default function DeleteTourDialog({ tour, onClose }: DeleteTourDialogProps) {
  const [formError, setFormError] = useState('');
  const modalRef = useFocusTrap<HTMLDivElement>();
  const { mutate: deleteTour, isPending } = useDeleteTour();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, isPending]);

  const handleConfirm = () => {
    setFormError('');
    deleteTour(tour.id, {
      onSuccess: onClose,
      onError: (err) => setFormError(err.message || 'Xóa tour thất bại, vui lòng thử lại.'),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isPending) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-tour-title"
        className="bg-surface-card rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="flex items-center justify-between p-5 border-b border-borderSubtle">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h2 id="delete-tour-title" className="text-base font-bold text-textStrong">
              Xác nhận xóa tour
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Đóng"
            className="p-1.5 rounded-lg text-textSubtle hover:text-textStrong hover:bg-borderSubtle transition-colors disabled:opacity-40 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-sm text-textBody">
            Bạn đang xóa tour <span className="font-bold text-textStrong">{tour.name}</span>. Hành
            động này không thể hoàn tác.
          </p>
          <p className="text-xs text-textMuted">
            Toàn bộ đánh giá của tour này ({tour.reviews} đánh giá) cũng sẽ bị xóa. Các đơn hàng đã
            đặt vẫn được giữ lại trong lịch sử.
          </p>
          {formError && <p className="text-xs text-rose-600 font-medium">{formError}</p>}
        </div>

        <div className="p-5 border-t border-borderSubtle flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-textSubtle hover:text-textStrong border border-borderSubtle rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
          >
            Giữ tour
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors disabled:opacity-70 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <span>Xác nhận xóa</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
