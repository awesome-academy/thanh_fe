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

  // Fix UX & A11y: Truncate page window for large page count and add aria-current
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
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

      {getPageNumbers().map((item, idx) => {
        if (typeof item === 'string') {
          return (
            <span key={`ellipsis-${idx}`} className="px-1 text-xs text-textSubtle select-none">
              ...
            </span>
          );
        }

        const pageNum = item;
        const isActive = pageNum === currentPage;

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => handlePageChange(pageNum)}
            aria-current={isActive ? 'page' : undefined}
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
