'use client';

import { Tour } from '@/types';
import { useDestinations } from '@/hooks/use-destinations';
import { formatCurrency } from '@/lib/format';
import { Pencil, Trash2, AlertTriangle, PackageOpen, SearchX, Star } from 'lucide-react';

interface TourDataTableProps {
  tours?: Tour[];
  isLoading: boolean;
  isError?: boolean;
  error?: Error | null;
  /** True when any filter is active, so the empty state can say which case it is. */
  isFiltered?: boolean;
  onClearFilters?: () => void;
  onEdit: (tour: Tour) => void;
  onDelete: (tour: Tour) => void;
}

export default function TourDataTable({
  tours,
  isLoading,
  isError = false,
  error,
  isFiltered = false,
  onClearFilters,
  onEdit,
  onDelete,
}: TourDataTableProps) {
  const { data: destinations } = useDestinations();
  const destMap: Record<string, string> = Object.fromEntries(
    (destinations || []).map((d) => [d.slug, d.name])
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-14 bg-surface-card border border-borderSubtle rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface-card border border-rose-200 rounded-2xl p-10 text-center space-y-2">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <p className="text-sm font-bold text-textStrong">Không thể tải danh sách tour</p>
        <p className="text-xs text-textMuted">{error?.message}</p>
      </div>
    );
  }

  if (!tours || tours.length === 0) {
    // A filtered-to-zero table looks identical to data loss unless it says so.
    if (isFiltered) {
      return (
        <div className="bg-surface-card border border-borderSubtle rounded-2xl p-10 text-center space-y-3">
          <SearchX className="w-8 h-8 text-textSubtle/50 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-textStrong">Không tìm thấy tour phù hợp</p>
            <p className="text-xs text-textMuted">
              Không có tour nào khớp với bộ lọc hiện tại. Thử xóa bớt điều kiện lọc.
            </p>
          </div>
          {onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cacao-600 hover:bg-cacao-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="bg-surface-card border border-borderSubtle rounded-2xl p-10 text-center space-y-2">
        <PackageOpen className="w-8 h-8 text-textSubtle/50 mx-auto" />
        <p className="text-sm font-bold text-textStrong">Chưa có tour nào</p>
        <p className="text-xs text-textMuted">Bấm &ldquo;Thêm tour&rdquo; để tạo tour đầu tiên.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-card border border-borderSubtle rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-surface-page text-left">
          <tr className="text-[11px] uppercase tracking-widest text-textMuted">
            <th className="px-4 py-3 font-semibold">Tên tour</th>
            <th className="px-4 py-3 font-semibold">Điểm đến</th>
            <th className="px-4 py-3 font-semibold text-center">Số ngày</th>
            <th className="px-4 py-3 font-semibold text-right">Giá</th>
            <th className="px-4 py-3 font-semibold text-center">Đánh giá</th>
            <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.id} className="border-t border-borderSubtle hover:bg-surface-page/60">
              <td className="px-4 py-3">
                <p className="font-semibold text-textStrong line-clamp-1">{tour.name}</p>
                <p className="text-[11px] text-textSubtle font-mono">{tour.slug}</p>
              </td>
              <td className="px-4 py-3 text-textBody">
                {destMap[tour.dest] ? (
                  destMap[tour.dest]
                ) : (
                  <span
                    className="font-mono text-xs text-textSubtle"
                    title={`Chưa có điểm đến "${tour.dest}" trong danh mục`}
                  >
                    {tour.dest}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-center text-textBody tabular-nums">{tour.days}</td>
              <td className="px-4 py-3 text-right font-semibold text-cacao-600 tabular-nums">
                {formatCurrency(tour.price)}
              </td>
              <td className="px-4 py-3">
                <span className="flex items-center justify-center gap-1 text-xs text-textBody tabular-nums">
                  <Star className="w-3.5 h-3.5 text-status-star fill-current" />
                  {tour.rating} ({tour.reviews})
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(tour)}
                    aria-label={`Sửa ${tour.name}`}
                    className="p-2 rounded-lg text-textSubtle hover:text-cacao-600 hover:bg-cacao-50 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(tour)}
                    aria-label={`Xóa ${tour.name}`}
                    className="p-2 rounded-lg text-textSubtle hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
