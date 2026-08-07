'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useDestinations } from '@/hooks/use-destinations';
import { useCategories } from '@/hooks/use-categories';
import { Filter, RotateCcw, MapPin, Tag, DollarSign, Calendar, Star, X } from 'lucide-react';

interface TourFilterSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function TourFilterSidebar({ mobileOpen = false, onMobileClose }: TourFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: destinations } = useDestinations();
  const { data: categories } = useCategories();

  // Read current filters from URL SearchParams
  const activeDest = searchParams.get('dest') || '';
  const activeType = searchParams.get('type') || '';
  const activeMinPrice = searchParams.get('minPrice') || '';
  const activeMaxPrice = searchParams.get('maxPrice') || '';
  const activeDuration = searchParams.get('duration') || '';
  const activeMinRating = searchParams.get('minRating') || '';

  // Helper to update single query param in URL
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Helper to update fixed price range preset
  const updatePriceRange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min); else params.delete('minPrice');
    if (max) params.set('maxPrice', max); else params.delete('maxPrice');
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    router.push(pathname, { scroll: false });
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
        <div className="flex items-center gap-2 font-bold text-textStrong text-lg">
          <Filter className="w-5 h-5 text-cacao-600" />
          <span>Bộ Lọc Tìm Kiếm</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-cacao-600 hover:text-cacao-700 font-medium flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xóa lọc</span>
        </button>
      </div>

      {/* Destination Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cacao-500" />
          <span>Điểm đến</span>
        </h4>
        <select
          value={activeDest}
          onChange={(e) => updateParam('dest', e.target.value)}
          className="w-full bg-surface-page border border-borderSubtle rounded-lg px-3 py-2 text-sm text-textStrong focus:ring-2 focus:ring-cacao-500 outline-none cursor-pointer"
        >
          <option value="">Tất cả điểm đến</option>
          {destinations?.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name} ({d.tourCount} tour)
            </option>
          ))}
        </select>
      </div>

      {/* Category / Type Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-cacao-500" />
          <span>Danh mục tour</span>
        </h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-textBody cursor-pointer hover:text-textStrong">
            <input
              type="radio"
              name="typeFilter"
              checked={!activeType}
              onChange={() => updateParam('type', '')}
              className="accent-cacao-600"
            />
            <span>Tất cả danh mục</span>
          </label>
          {categories?.map((cat) => (
            <label
              key={cat.slug}
              className="flex items-center justify-between text-sm text-textBody cursor-pointer hover:text-textStrong"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="typeFilter"
                  checked={activeType === cat.slug}
                  onChange={() => updateParam('type', cat.slug)}
                  className="accent-cacao-600"
                />
                <span>{cat.name}</span>
              </div>
              <span className="text-xs text-textSubtle">({cat.tourCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fixed Preset Price Range Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-cacao-500" />
          <span>Mức giá</span>
        </h4>
        <div className="space-y-1.5 text-xs">
          {[
            { label: 'Tất cả mức giá', min: '', max: '' },
            { label: 'Dưới 3,000,000 đ', min: '', max: '3000000' },
            { label: '3,000,000 đ — 5,000,000 đ', min: '3000000', max: '5000000' },
            { label: 'Trên 5,000,000 đ', min: '5000000', max: '' },
          ].map((preset, idx) => {
            const isSelected = activeMinPrice === preset.min && activeMaxPrice === preset.max;
            return (
              <label
                key={idx}
                className="flex items-center gap-2 text-xs text-textBody cursor-pointer hover:text-textStrong"
              >
                <input
                  type="radio"
                  name="pricePreset"
                  checked={isSelected}
                  onChange={() => updatePriceRange(preset.min, preset.max)}
                  className="accent-cacao-600"
                />
                <span>{preset.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Duration Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-cacao-500" />
          <span>Thời gian tour</span>
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: 'Tất cả', val: '' },
            { label: '2 Ngày', val: '2' },
            { label: '3 Ngày', val: '3' },
            { label: '4 Ngày+', val: '4' },
          ].map((item) => (
            <button
              type="button"
              key={item.val}
              onClick={() => updateParam('duration', item.val)}
              className={`px-3 py-2 rounded-lg border text-center font-medium transition-colors ${
                activeDuration === item.val
                  ? 'bg-cacao-600 text-white border-cacao-600'
                  : 'bg-surface-page border-borderSubtle text-textBody hover:border-cacao-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-textMuted uppercase tracking-wider flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-status-star" />
          <span>Đánh giá tối thiểu</span>
        </h4>
        <div className="space-y-1.5 text-xs">
          {[
            { label: 'Tất cả số sao', val: '' },
            { label: '4.8 sao trở lên', val: '4.8' },
            { label: '4.5 sao trở lên', val: '4.5' },
          ].map((item) => (
            <label
              key={item.val}
              className="flex items-center gap-2 text-sm text-textBody cursor-pointer hover:text-textStrong"
            >
              <input
                type="radio"
                name="ratingFilter"
                checked={activeMinRating === item.val}
                onChange={() => updateParam('minRating', item.val)}
                className="accent-cacao-600"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-surface-card border border-borderSubtle rounded-2xl p-6 h-fit shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative ml-auto w-full max-w-xs bg-surface-card h-full p-6 overflow-y-auto shadow-2xl space-y-6">
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 text-textMuted hover:text-textStrong"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
