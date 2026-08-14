'use client';

import { useState } from 'react';
import { Booking } from '@/types';
import BookingCard from './BookingCard';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled';

const TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Đang chờ' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  { key: 'cancelled', label: 'Đã hủy' },
];

interface BookingListProps {
  bookings: Booking[];
  onViewDetail: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}

export default function BookingList({ bookings, onViewDetail, onCancel }: BookingListProps) {
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');

  const counts: Record<StatusFilter, number> = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  const filtered = bookings
    .filter((b) => activeTab === 'all' || b.status === activeTab)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-surface-card border border-borderSubtle rounded-xl p-1 w-full overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex-1 min-w-max flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === key
                ? 'bg-cacao-600 text-white shadow-sm'
                : 'text-textSubtle hover:text-textStrong'
            }`}
          >
            {label}
            {counts[key] > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === key ? 'bg-white/20 text-white' : 'bg-borderSubtle text-textMuted'
                }`}
              >
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-textMuted text-sm">
          Không có đơn hàng nào trong mục này.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onViewDetail={() => onViewDetail(booking)}
              onCancel={() => onCancel(booking)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
