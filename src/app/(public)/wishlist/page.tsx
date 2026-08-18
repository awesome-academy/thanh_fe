'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '@/stores/use-wishlist-store';
import { useTours } from '@/hooks/use-tours';
import { useDestinations } from '@/hooks/use-destinations';
import WishlistCard from '@/components/wishlist/WishlistCard';
import WishlistEmptyState from '@/components/wishlist/WishlistEmptyState';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { data: toursData, isLoading } = useTours({ ids: wishlistIds }, mounted);
  const { data: destinations } = useDestinations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const destMap: Record<string, string> = Object.fromEntries(
    (destinations || []).map((d) => [d.slug, d.name])
  );

  const savedTours = toursData?.data || [];

  const handleBookNow = (slug: string) => {
    router.push(`/checkout?slug=${encodeURIComponent(slug)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-borderSubtle pb-5 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-textStrong">Danh sách Tour Yêu thích</h1>
          </div>
          <p className="text-xs sm:text-sm text-textMuted">
            Quản lý và dễ dàng đặt các chuyến du lịch mơ ước mà bạn đã lưu
          </p>
        </div>
        {mounted && (
          <span className="text-xs font-semibold text-cacao-600 bg-cacao-50 border border-cacao-200 px-3 py-1.5 rounded-full w-fit">
            {savedTours.length} tour đã lưu
          </span>
        )}
      </div>

      {/* Loading & Hydration Guard */}
      {(!mounted || isLoading) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-card border border-borderSubtle rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {mounted && !isLoading && savedTours.length === 0 && (
        <WishlistEmptyState />
      )}

      {/* Wishlist Grid */}
      {mounted && !isLoading && savedTours.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTours.map((tour) => (
            <WishlistCard
              key={tour.id}
              tour={tour}
              destinationName={destMap[tour.dest]}
              onRemove={() => toggleWishlist(tour.id)}
              onBookNow={() => handleBookNow(tour.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
