'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Tour } from '@/types';
import { Star, MapPin, Clock, Trash2, ArrowRight } from 'lucide-react';
import { TOUR_IMAGE_BLUR, TOUR_GRADIENT_FALLBACK } from '@/lib/image-placeholder';

interface WishlistCardProps {
  tour: Tour;
  destinationName?: string;
  onRemove: () => void;
  onBookNow: () => void;
}

export default function WishlistCard({
  tour,
  destinationName,
  onRemove,
  onBookNow,
}: WishlistCardProps) {
  const dest = destinationName || tour.dest;

  return (
    <article className="group bg-surface-card border border-borderSubtle rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Tour Image Header */}
      <Link href={`/tours/${tour.slug}`} className="relative h-48 bg-navy-900 overflow-hidden block">
        {tour.image ? (
          <Image
            src={tour.image}
            alt={tour.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={TOUR_IMAGE_BLUR}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: tour.gradient || TOUR_GRADIENT_FALLBACK }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="absolute top-3 left-3 z-20 bg-cacao-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          {tour.rating >= 4.8 ? '5 Sao Bán Chạy' : 'Nổi Bật'}
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-cacao-300" />
            {dest}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cacao-300" />
            {tour.days} ngày
          </span>
        </div>
      </Link>

      {/* Tour Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/tours/${tour.slug}`}>
            <h3 className="font-bold text-textStrong text-base line-clamp-2 group-hover:text-cacao-600 transition-colors">
              {tour.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-2 text-xs">
            <Star className="w-3.5 h-3.5 text-status-star fill-current" />
            <span className="font-bold text-textStrong">{tour.rating}</span>
            <span className="text-textSubtle">({tour.reviews} đánh giá)</span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-borderSubtle space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-textSubtle">Giá trọn gói</span>
            <span className="text-base font-extrabold text-cacao-600">
              {tour.price.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bỏ lưu</span>
            </button>
            <button
              type="button"
              onClick={onBookNow}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-cacao-600 hover:bg-cacao-700 transition-colors cursor-pointer shadow-sm"
            >
              <span>Đặt ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
