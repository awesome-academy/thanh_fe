'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Tour } from '@/types';
import { useAdminTours } from '@/hooks/use-admin-tours';
import AdminTourToolbar from '@/components/admin/AdminTourToolbar';
import TourDataTable from '@/components/admin/TourDataTable';
import TourFormModal from '@/components/admin/TourFormModal';
import DeleteTourDialog from '@/components/admin/DeleteTourDialog';
import TourPagination from '@/components/tours/TourPagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const PAGE_SIZE = 10;

function AdminToursContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Form state and delete state are tracked separately so the two dialogs
  // can never be open at the same time.
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingTour, setDeletingTour] = useState<Tour | null>(null);

  const search = searchParams.get('search') || '';
  const dest = searchParams.get('dest') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const { data, isLoading, isError, error } = useAdminTours({
    search,
    dest,
    type,
    sort,
    page,
    limit: PAGE_SIZE,
  });

  const isFiltered = Boolean(search || dest || type);
  const clearFilters = () => router.push(pathname, { scroll: false });

  // The server clamps an out-of-range page (deleting the last row of the last
  // page). Mirror that back into the URL so a refresh or a bookmark does not
  // carry a page number that no longer exists.
  const servedPage = data?.page;
  useEffect(() => {
    if (!servedPage || servedPage === page) return;
    const params = new URLSearchParams(searchParams.toString());
    if (servedPage === 1) {
      params.delete('page');
    } else {
      params.set('page', String(servedPage));
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [servedPage, page, pathname, router, searchParams]);

  const openCreate = () => {
    setEditingTour(null);
    setIsFormOpen(true);
  };

  const openEdit = (tour: Tour) => {
    setEditingTour(tour);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTour(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textStrong">Quản lý Tour</h1>
          <p className="text-sm text-textMuted mt-1">
            Tạo, cập nhật và xóa tour du lịch trong hệ thống
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          className="bg-cacao-600 hover:bg-cacao-700 text-white font-bold rounded-xl flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm tour</span>
        </Button>
      </div>

      <AdminTourToolbar
        total={data?.total ?? 0}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
      />

      <TourDataTable
        tours={data?.data}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFiltered={isFiltered}
        onClearFilters={clearFilters}
        onEdit={openEdit}
        onDelete={setDeletingTour}
      />

      <TourPagination currentPage={data?.page ?? 1} totalPages={data?.totalPages ?? 1} />

      {isFormOpen && <TourFormModal tour={editingTour} onClose={closeForm} />}

      {deletingTour && (
        <DeleteTourDialog tour={deletingTour} onClose={() => setDeletingTour(null)} />
      )}
    </div>
  );
}

export default function AdminToursPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-9 w-64 bg-surface-card border border-borderSubtle rounded-xl animate-pulse" />
          <div className="h-20 bg-surface-card border border-borderSubtle rounded-2xl animate-pulse" />
          <div className="h-64 bg-surface-card border border-borderSubtle rounded-2xl animate-pulse" />
        </div>
      }
    >
      <AdminToursContent />
    </Suspense>
  );
}
