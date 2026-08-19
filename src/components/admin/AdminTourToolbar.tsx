'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDestinations } from '@/hooks/use-destinations';
import { useCategories } from '@/hooks/use-categories';
import { Search, RotateCcw } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'name', label: 'Tên A → Z' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
];

const SEARCH_DEBOUNCE_MS = 300;

const controlClass =
  'px-3 py-2 text-sm text-textStrong bg-surface-page border border-borderSubtle rounded-xl focus:outline-none focus:ring-2 focus:ring-cacao-500/30 focus:border-cacao-500 transition-colors';

interface AdminTourToolbarProps {
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminTourToolbar({ total, page, totalPages }: AdminTourToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Re-sync when the URL changes from outside this input (clear-filters, back).
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const setParam = useCallback(
    (key: string, value: string, { replace = false } = {}) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      const url = `${pathname}?${params.toString()}`;
      if (replace) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [router, pathname, searchParams]
  );

  // Debounce the search box: one request per pause, not per keystroke.
  useEffect(() => {
    if (searchInput === urlSearch) return;
    const timer = setTimeout(
      () => setParam('search', searchInput, { replace: true }),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, setParam]);

  const { data: destinations } = useDestinations();
  const { data: categories } = useCategories();

  const hasFilters = Boolean(
    searchParams.get('search') ||
      searchParams.get('dest') ||
      searchParams.get('type') ||
      searchParams.get('sort')
  );

  return (
    <div className="bg-surface-card border border-borderSubtle rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSubtle pointer-events-none" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên hoặc slug tour..."
            aria-label="Tìm kiếm tour"
            className={`${controlClass} w-full pl-9`}
          />
        </div>

        <select
          value={searchParams.get('dest') || ''}
          onChange={(e) => setParam('dest', e.target.value)}
          aria-label="Lọc theo điểm đến"
          className={`${controlClass} lg:w-44`}
        >
          <option value="">Tất cả điểm đến</option>
          {(destinations || []).map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get('type') || ''}
          onChange={(e) => setParam('type', e.target.value)}
          aria-label="Lọc theo loại tour"
          className={`${controlClass} lg:w-44`}
        >
          <option value="">Tất cả loại tour</option>
          {(categories || []).map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get('sort') || 'newest'}
          onChange={(e) => setParam('sort', e.target.value)}
          aria-label="Sắp xếp"
          className={`${controlClass} lg:w-48`}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <p className="text-textMuted">
          <span className="font-bold text-textStrong tabular-nums">{total}</span> tour
          {totalPages > 1 && (
            <span className="text-textSubtle">
              {' '}
              · trang <span className="tabular-nums">{page}</span>/
              <span className="tabular-nums">{totalPages}</span>
            </span>
          )}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold text-cacao-600 hover:bg-cacao-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa bộ lọc</span>
          </button>
        )}
      </div>
    </div>
  );
}
