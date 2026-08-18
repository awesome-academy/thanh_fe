'use client';

import Link from 'next/link';
import { useTours } from '@/hooks/use-tours';
import { useDestinations } from '@/hooks/use-destinations';
import TourCard from '@/components/tours/TourCard';

export default function FeaturedTours() {
  const { data, isLoading } = useTours({ limit: 4, sort: 'rating' });
  const { data: destinations } = useDestinations();

  const destMap: Record<string, string> = Object.fromEntries(
    (destinations || []).map((d) => [d.slug, d.name])
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-bold text-cacao-600 uppercase tracking-widest">Gợi Ý Hàng Đầu</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-textStrong mt-1">Tour Nổi Bật Được Yêu Thích</h2>
        </div>
        <Link href="/tours" className="text-sm font-medium text-cacao-600 hover:text-cacao-700 transition-colors">
          Xem tất cả tour &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-card rounded-2xl h-80 animate-pulse border border-borderSubtle" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.data?.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              destinationName={destMap[tour.dest] || tour.dest}
            />
          ))}
        </div>
      )}
    </section>
  );
}
