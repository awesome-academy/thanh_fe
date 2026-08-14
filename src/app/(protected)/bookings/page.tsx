'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Booking } from '@/types';
import { useBookings } from '@/hooks/use-bookings';
import BookingList from '@/components/bookings/BookingList';
import BookingDetailModal from '@/components/bookings/BookingDetailModal';
import CancelBookingModal from '@/components/bookings/CancelBookingModal';
import { RotateCcw, Compass, AlertTriangle, Receipt } from 'lucide-react';

type ActiveModal = 'detail' | 'cancel' | null;

export default function BookingsPage() {
  const { data: bookings, isLoading, isError, refetch } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setActiveModal('detail');
  };

  const handleCancelClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setActiveModal('cancel');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedBooking(null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-cacao-600" />
          <h1 className="text-2xl font-bold text-textStrong">Đơn đặt của tôi</h1>
        </div>
        <p className="text-sm text-textMuted">Xem lịch sử đặt tour và quản lý đơn hàng</p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-card border border-borderSubtle rounded-2xl h-44 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <div className="bg-surface-card border border-rose-200 rounded-2xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-textStrong">Không thể tải đơn hàng</h2>
            <p className="text-xs text-textMuted mt-1">Vui lòng thử lại.</p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cacao-600 hover:bg-cacao-700 text-white text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && bookings && bookings.length === 0 && (
        <div className="bg-surface-card border border-borderSubtle rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-cacao-50 text-cacao-600 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-textStrong">Bạn chưa có đơn đặt tour nào</h2>
            <p className="text-xs text-textMuted mt-1">Hãy khám phá và đặt chuyến du lịch đầu tiên!</p>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cacao-600 hover:bg-cacao-700 text-white text-xs font-semibold transition-colors"
          >
            <Compass className="w-4 h-4" />
            Khám phá tour
          </Link>
        </div>
      )}

      {/* Booking List */}
      {!isLoading && !isError && bookings && bookings.length > 0 && (
        <BookingList
          bookings={bookings}
          onViewDetail={handleViewDetail}
          onCancel={handleCancelClick}
        />
      )}

      {/* Modals */}
      {selectedBooking && activeModal === 'detail' && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={handleCloseModal}
          onCancelClick={() => setActiveModal('cancel')}
        />
      )}
      {selectedBooking && activeModal === 'cancel' && (
        <CancelBookingModal
          booking={selectedBooking}
          onClose={handleCloseModal}
          onSuccess={handleCloseModal}
        />
      )}
    </div>
  );
}
