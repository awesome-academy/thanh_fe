'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTours } from '@/hooks/use-tours';
import TourFilterSidebar from '@/components/tours/TourFilterSidebar';
import TourSortBar from '@/components/tours/TourSortBar';
import TourGrid from '@/components/tours/TourGrid';
import TourPagination from '@/components/tours/TourPagination';

function ToursPageContent() {
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract params from URL for React Query
  const search = searchParams.get('search') || '';
  const dest = searchParams.get('dest') || '';
  const type = searchParams.get('type') || '';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 0;
  const duration = Number(searchParams.get('duration')) || 0;
  const minRating = Number(searchParams.get('minRating')) || 0;
  const sort = searchParams.get('sort') || 'recommended';
  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading, isError, refetch } = useTours({
    search,
    dest,
    type,
    minPrice,
    maxPrice,
    duration,
    minRating,
    sort,
    page,
    limit: 6,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-4xl font-bold text-textStrong tracking-tight">
          Danh Sách Tour Du Lịch
        </h1>
        <p className="text-sm text-textMuted">
          Khám phá hơn 480+ chuyến đi hấp dẫn với giá minh bạch và xác nhận đặt chỗ nhanh chóng.
        </p>
      </div>

      {/* Main 2-Column Layout */}
      <div className="flex gap-8 items-start">
        {/* Left Filter Sidebar */}
        <TourFilterSidebar
          mobileOpen={mobileFilterOpen}
          onMobileClose={() => setMobileFilterOpen(false)}
        />

        {/* Right Main Content */}
        <main className="flex-1 space-y-6 min-w-0">
          <TourSortBar
            total={data?.total || 0}
            onOpenMobileFilter={() => setMobileFilterOpen(true)}
          />
          <TourGrid
            tours={data?.data}
            isLoading={isLoading}
            isError={isError}
            refetch={refetch}
          />
          <TourPagination
            currentPage={data?.page || 1}
            totalPages={data?.totalPages || 1}
          />
        </main>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 text-center text-textMuted">
          Đang tải danh sách tour...
        </div>
      }
    >
      <ToursPageContent />
    </Suspense>
  );
}
