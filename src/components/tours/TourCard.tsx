'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Star, Heart } from 'lucide-react';
import { Tour } from '@/types';
import { formatCurrency } from '@/lib/format';
import { TOUR_IMAGE_BLUR } from '@/lib/image-placeholder';
import { useWishlistStore } from '@/stores/use-wishlist-store';

interface TourCardProps {
  tour: Tour;
  destinationName?: string;
}

export default function TourCard({ tour, destinationName }: TourCardProps) {
  const wishlistIds = useWishlistStore((state) => state.wishlistIds);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isFav = mounted && wishlistIds.includes(tour.id);
  const destName = destinationName || tour.dest;

  return (
    <article className="group bg-surface-card border border-borderSubtle rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative">
      {/* Primary Clickable Overlay Link for the Card */}
      <Link
        href={`/tours/${tour.slug}`}
        className="absolute inset-0 z-0"
        aria-label={tour.name}
      />

      {/* Tour Card Header Image */}
      <div className="relative h-48 bg-navy-900 overflow-hidden pointer-events-none">
        {tour.image ? (
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            placeholder="blur"
            blurDataURL={TOUR_IMAGE_BLUR}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: tour.gradient || 'linear-gradient(135deg, #0F6FBD 0%, #137DD0 100%)' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="absolute top-3 left-3 z-20 bg-cacao-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          {tour.rating >= 4.8 ? '5 Sao Bán Chạy' : 'Nổi Bật'}
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-cacao-300" />
            {destName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cacao-300" />
            {tour.days} ngày
          </span>
        </div>
      </div>

      {/* Sibling Wishlist Toggle Button (Independent interactive element z-20) */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(tour.id);
        }}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 transition-transform cursor-pointer"
        aria-label={isFav ? `Xóa "${tour.name}" khỏi danh sách yêu thích` : `Thêm "${tour.name}" vào danh sách yêu thích`}
        aria-pressed={isFav}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Tour Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 pointer-events-none">
        <div>
          <h3 className="font-bold text-textStrong text-base line-clamp-2 group-hover:text-cacao-600 transition-colors">
            {tour.name}
          </h3>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <Star className="w-3.5 h-3.5 text-status-star fill-current" />
            <span className="font-bold text-textStrong">{tour.rating}</span>
            <span className="text-textSubtle">({tour.reviews} đánh giá)</span>
          </div>
        </div>

        <div className="pt-3 border-t border-borderSubtle flex items-center justify-between mt-auto">
          <div>
            <span className="text-[11px] text-textSubtle block">Giá từ</span>
            <span className="text-base font-extrabold text-cacao-600">
              {formatCurrency(tour.price)}
            </span>
          </div>
          <span className="text-xs font-bold text-cacao-600 group-hover:translate-x-1 transition-transform">
            Chi tiết &rarr;
          </span>
        </div>
      </div>
    </article>
  );
}
