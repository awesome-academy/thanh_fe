'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Tour } from '@/types';
import { useWishlistStore } from '@/stores/use-wishlist-store';
import { useDestinations } from '@/hooks/use-destinations';
import { TOUR_IMAGE_BLUR } from '@/lib/image-placeholder';
import { Star, MapPin, Clock, Heart, SearchX, RotateCcw, AlertTriangle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface TourGridProps {
  tours?: Tour[];
  isLoading: boolean;
  isError?: boolean;
  refetch?: () => void;
}

export default function TourGrid({ tours, isLoading, isError = false, refetch }: TourGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const { data: destinations } = useDestinations();

  const destMap: Record<string, string> = Object.fromEntries(
    (destinations || []).map((d) => [d.slug, d.name])
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-card rounded-2xl h-80 animate-pulse border border-borderSubtle" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface-card border border-rose-200 rounded-2xl p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-textStrong">Không thể tải danh sách tour</h3>
          <p className="text-xs text-textMuted max-w-sm mx-auto leading-relaxed">
            Đã có lỗi xảy ra khi tải dữ liệu từ hệ thống. Vui lòng thử tải lại hoặc kiểm tra kết nối mạng.
          </p>
        </div>
        {refetch && (
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cacao-600 hover:bg-cacao-700 text-white font-medium text-xs shadow-md transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>
        )}
      </div>
    );
  }

  if (!tours || tours.length === 0) {
    return (
      <div className="bg-surface-card border border-borderSubtle rounded-2xl p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-cacao-50 text-cacao-600 flex items-center justify-center mx-auto">
          <SearchX className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-textStrong">Không tìm thấy tour phù hợp</h3>
          <p className="text-xs text-textMuted max-w-sm mx-auto leading-relaxed">
            Rất tiếc, không có tour du lịch nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng thử xóa bớt bộ lọc.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(pathname, { scroll: false })}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cacao-600 hover:bg-cacao-700 text-white font-medium text-xs shadow-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Xóa tất cả bộ lọc</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => {
        const isFav = wishlistIds.includes(tour.id);
        const destinationName = destMap[tour.dest] || tour.dest;

        return (
          <Link
            key={tour.id}
            href={`/tours/${tour.slug}`}
            className="group bg-surface-card border border-borderSubtle rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Tour Image Header */}
            <div className="relative h-48 bg-navy-900 overflow-hidden">
              {tour.image ? (
                <Image
                  src={tour.image}
                  alt={tour.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={TOUR_IMAGE_BLUR}
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
                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 transition-transform"
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
  );
}
