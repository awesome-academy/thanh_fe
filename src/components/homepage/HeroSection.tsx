'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDestinations } from '@/hooks/use-destinations';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar, Compass } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const { data: destinations } = useDestinations();
  const [dest, setDest] = useState('');
  const [duration, setDuration] = useState('');
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dest) params.set('dest', dest);
    if (duration) params.set('duration', duration);
    if (search.trim()) params.set('search', search.trim());
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-br from-navy-900 via-cacao-700 to-cacao-500 text-white px-4 sm:px-8 pt-16 pb-24 sm:pt-20 sm:pb-28">
      <div className="max-w-5xl mx-auto space-y-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-sky-200">
          <Compass className="w-4 h-4 text-cacao-300" />
          <span>Khám Phá Việt Nam</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Tìm Chuyến Đi Mơ Ước <br className="hidden sm:inline" />
          <span className="text-cacao-200">Dành Cho Bạn</span>
        </h1>

        <p className="text-sky-100 max-w-xl text-sm sm:text-base leading-relaxed">
          Hơn 480+ tour du lịch trong nước, giá minh bạch, đặt chỗ nhanh chóng và bảo đảm hoàn tiền 100%.
        </p>

        {/* Integrated Quick Search Bar */}
        <form
          onSubmit={handleSearch}
          className="mt-8 bg-surface-card text-textBody rounded-2xl p-4 sm:p-5 shadow-2xl border border-borderSubtle grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end"
        >
          {/* Destination Selector */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="dest-select" className="text-xs font-semibold text-textMuted flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cacao-500" />
              <span>Điểm đến</span>
            </label>
            <select
              id="dest-select"
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full bg-surface-page border border-borderSubtle rounded-lg px-3 py-2 text-sm text-textStrong focus:outline-none focus:ring-2 focus:ring-cacao-500"
            >
              <option value="">Tất cả điểm đến</option>
              {destinations?.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selector */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="duration-select" className="text-xs font-semibold text-textMuted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cacao-500" />
              <span>Thời gian tour</span>
            </label>
            <select
              id="duration-select"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-surface-page border border-borderSubtle rounded-lg px-3 py-2 text-sm text-textStrong focus:outline-none focus:ring-2 focus:ring-cacao-500"
            >
              <option value="">Tất cả số ngày</option>
              <option value="2">2 ngày 1 đêm</option>
              <option value="3">3 ngày 2 đêm</option>
              <option value="4">4 ngày 3 đêm</option>
            </select>
          </div>

          {/* Keyword Input */}
          <div className="space-y-1.5 text-left">
            <label htmlFor="keyword-input" className="text-xs font-semibold text-textMuted flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cacao-500" />
              <span>Từ khóa</span>
            </label>
            <input
              id="keyword-input"
              type="text"
              placeholder="VD: Hạ Long, Du thuyền..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-page border border-borderSubtle rounded-lg px-3 py-2 text-sm text-textStrong focus:outline-none focus:ring-2 focus:ring-cacao-500"
            />
          </div>

          {/* Search Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-cacao-600 hover:bg-cacao-700 text-white font-medium shadow-md flex items-center justify-center gap-2 h-[42px]"
          >
            <Search className="w-4 h-4" />
            <span>Tìm tour ngay</span>
          </Button>
        </form>
      </div>
    </section>
  );
}
