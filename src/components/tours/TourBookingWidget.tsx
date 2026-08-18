'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/stores/use-wishlist-store';
import { Button } from '@/components/ui/button';
import { toLocalDateString } from '@/lib/format';

const MAX_GUESTS = 20;

interface TourBookingWidgetProps {
  tourId: string;
  slug: string;
  price: number;
  kidPrice: number;
}

export default function TourBookingWidget({ tourId, slug, price, kidPrice }: TourBookingWidgetProps) {
  const router = useRouter();
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const [mounted, setMounted] = useState(false);
  const [todayStr, setTodayStr] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    setMounted(true);
    setTodayStr(toLocalDateString(new Date()));
    setDate(toLocalDateString(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)));
  }, []);

  const isFav = mounted && wishlistIds.includes(tourId);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const totalGuests = adults + children;

  const totalPrice = adults * price + children * kidPrice;

  const handleBooking = () => {
    const params = new URLSearchParams({
      slug,
      date,
      adults: String(adults),
      children: String(children),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="bg-surface-card border border-borderSubtle rounded-2xl p-6 shadow-xl space-y-6 sticky top-24">
      {/* Price Header */}
      <div className="pb-4 border-b border-borderSubtle flex items-end justify-between">
        <div>
          <span className="text-xs text-textSubtle block">Giá trọn gói từ</span>
          <span className="text-2xl font-bold text-cacao-600">
            {price.toLocaleString('vi-VN')} đ
          </span>
          <span className="text-xs text-textSubtle"> / khách</span>
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(tourId)}
          className="w-10 h-10 rounded-full border border-borderSubtle flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label={isFav ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={isFav}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Date Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cacao-500" />
          <span>Ngày khởi hành</span>
        </label>
        <input
          type="date"
          value={date}
          min={todayStr}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-surface-page border border-borderSubtle rounded-xl px-3 py-2.5 text-sm text-textStrong font-medium focus:ring-2 focus:ring-cacao-500 outline-none cursor-pointer"
        />
      </div>

      {/* Guest Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-cacao-500" />
          <span>Số lượng hành khách</span>
        </label>

        {/* Adults */}
        <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-surface-page border border-borderSubtle">
          <div>
            <p className="font-bold text-textStrong">Người lớn</p>
            <p className="text-textSubtle text-[11px]">Từ 12 tuổi ({price.toLocaleString('vi-VN')} đ)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={adults <= 1}
              onClick={() => setAdults(adults - 1)}
              className="w-7 h-7 rounded-lg border border-borderSubtle flex items-center justify-center font-bold text-textStrong disabled:opacity-40 cursor-pointer"
            >
              -
            </button>
            <span className="font-bold text-sm text-textStrong w-4 text-center">{adults}</span>
            <button
              type="button"
              disabled={totalGuests >= MAX_GUESTS}
              onClick={() => setAdults(adults + 1)}
              className="w-7 h-7 rounded-lg border border-borderSubtle flex items-center justify-center font-bold text-textStrong disabled:opacity-40 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-surface-page border border-borderSubtle">
          <div>
            <p className="font-bold text-textStrong">Trẻ em</p>
            <p className="text-textSubtle text-[11px]">Từ 2 — 11 tuổi ({kidPrice.toLocaleString('vi-VN')} đ)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={children <= 0}
              onClick={() => setChildren(children - 1)}
              className="w-7 h-7 rounded-lg border border-borderSubtle flex items-center justify-center font-bold text-textStrong disabled:opacity-40 cursor-pointer"
            >
              -
            </button>
            <span className="font-bold text-sm text-textStrong w-4 text-center">{children}</span>
            <button
              type="button"
              disabled={totalGuests >= MAX_GUESTS}
              onClick={() => setChildren(children + 1)}
              className="w-7 h-7 rounded-lg border border-borderSubtle flex items-center justify-center font-bold text-textStrong disabled:opacity-40 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Total Price Summary */}
      <div className="pt-4 border-t border-borderSubtle flex items-center justify-between">
        <span className="text-sm font-bold text-textStrong">Tổng chi phí:</span>
        <span className="text-xl font-bold text-cacao-600">
          {totalPrice.toLocaleString('vi-VN')} đ
        </span>
      </div>

      {/* Booking CTA Button */}
      <Button
        onClick={handleBooking}
        disabled={!date}
        size="lg"
        className="w-full bg-cacao-600 hover:bg-cacao-700 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Đặt Tour Ngay</span>
        <ArrowRight className="w-4 h-4" />
      </Button>

      {/* Guarantees */}
      <div className="pt-2 text-[11px] text-textSubtle flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Xác nhận tức thì — Hoàn hủy linh hoạt</span>
      </div>
    </div>
  );
}
