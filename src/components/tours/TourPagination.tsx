'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TourPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function TourPagination({ currentPage, totalPages }: TourPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: true });
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="w-9 h-9 rounded-xl border border-borderSubtle flex items-center justify-center text-textStrong disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cacao-50 hover:text-cacao-600 transition-colors"
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const pageNum = i + 1;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => handlePageChange(pageNum)}
            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-cacao-600 text-white shadow-md'
                : 'border border-borderSubtle text-textStrong hover:border-cacao-500 hover:text-cacao-600'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="w-9 h-9 rounded-xl border border-borderSubtle flex items-center justify-center text-textStrong disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cacao-50 hover:text-cacao-600 transition-colors"
        aria-label="Trang tiếp"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
