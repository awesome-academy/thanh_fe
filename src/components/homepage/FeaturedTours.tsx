'use client';

import Link from 'next/link';
import { useTours } from '@/hooks/use-tours';
import { useDestinations } from '@/hooks/use-destinations';
import { useWishlistStore } from '@/stores/use-wishlist-store';
import { Star, MapPin, Clock, Heart } from 'lucide-react';

export default function FeaturedTours() {
  const { data, isLoading } = useTours({ limit: 4, sort: 'rating' });
  const { data: destinations } = useDestinations();
  const { wishlistIds, toggleWishlist } = useWishlistStore();

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
          {data?.data?.map((tour) => {
            const isFav = wishlistIds.includes(tour.id);
            const destinationName = destMap[tour.dest] || tour.dest;
            return (
              <Link
                key={tour.id}
                href={`/tours/${tour.slug}`}
                className="group bg-surface-card border border-borderSubtle rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Tour Card Header Image */}
                <div className="relative h-48 bg-navy-900 overflow-hidden">
                  {tour.image ? (
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ background: tour.gradient || 'linear-gradient(135deg, #0F6FBD 0%, #137DD0 100%)' }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-3 left-3 z-20 bg-cacao-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {tour.rating >= 4.8 ? '5 Sao Bán Chạy' : 'Nổi Bật'}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(tour.id);
                    }}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 transition-transform cursor-pointer"
                    aria-label={isFav ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                    aria-pressed={isFav}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-cacao-300" />
                      {destinationName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cacao-300" />
                      {tour.days} ngày
                    </span>
                  </div>
                </div>

                {/* Tour Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-textStrong text-base line-clamp-2 group-hover:text-cacao-600 transition-colors">
                      {tour.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <Star className="w-3.5 h-3.5 text-status-star fill-current" />
                      <span className="font-bold text-textStrong">{tour.rating}</span>
                      <span className="text-textSubtle">({tour.reviews} đánh giá)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-borderSubtle flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-textSubtle">Giá chỉ từ</p>
                      <p className="text-base font-bold text-cacao-600">
                        {tour.price.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-cacao-50 text-cacao-600 font-semibold text-xs group-hover:bg-cacao-600 group-hover:text-white transition-colors">
                      Chi tiết
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
