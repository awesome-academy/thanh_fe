'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourSortBarProps {
  total: number;
  onOpenMobileFilter: () => void;
}

export default function TourSortBar({ total, onOpenMobileFilter }: TourSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'recommended';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-surface-card border border-borderSubtle rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Result Count & Mobile Filter Toggle Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenMobileFilter}
          className="lg:hidden flex items-center gap-2 border-borderSubtle"
        >
          <SlidersHorizontal className="w-4 h-4 text-cacao-600" />
          <span>Bộ lọc</span>
        </Button>
        <p className="text-sm text-textBody">
          Tìm thấy <span className="font-bold text-cacao-600">{total}</span> tour du lịch phù hợp
        </p>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="sort-select" className="text-xs font-semibold text-textMuted flex items-center gap-1 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-cacao-600" />
          <span>Sắp xếp:</span>
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleSortChange}
          className="w-full sm:w-auto bg-surface-page border border-borderSubtle rounded-lg px-3 py-1.5 text-xs font-medium text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none cursor-pointer"
        >
          <option value="recommended">Gợi ý hàng đầu</option>
          <option value="price-asc">Giá từ thấp đến cao</option>
          <option value="price-desc">Giá từ cao đến thấp</option>
          <option value="rating">Đánh giá cao nhất</option>
        </select>
      </div>
    </div>
  );
}
