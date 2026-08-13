'use client';

import { Tour } from '@/types';
import { useDestinations } from '@/hooks/use-destinations';
import { SearchX, RotateCcw, AlertTriangle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import TourCard from '@/components/tours/TourCard';

interface TourGridProps {
  tours?: Tour[];
  isLoading: boolean;
  isError?: boolean;
  refetch?: () => void;
}

export default function TourGrid({ tours, isLoading, isError = false, refetch }: TourGridProps) {
  const router = useRouter();
  const pathname = usePathname();
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
      {tours.map((tour) => (
        <TourCard
          key={tour.id}
          tour={tour}
          destinationName={destMap[tour.dest] || tour.dest}
        />
      ))}
    </div>
  );
}
