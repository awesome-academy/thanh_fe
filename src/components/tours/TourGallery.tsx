'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { TOUR_IMAGE_BLUR, TOUR_GRADIENT_FALLBACK } from '@/lib/image-placeholder';

interface TourGalleryProps {
  images?: string[];
  gradient?: string;
  tourName: string;
  categoryName?: string;
}

/** Tailwind needs whole class names, so the column count is mapped explicitly. */
const THUMBNAIL_GRID_COLS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export default function TourGallery({
  images = [],
  gradient,
  tourName,
  categoryName = 'DU LỊCH',
}: TourGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const currentMainImage = images[activeImageIndex];
  const gridCols = THUMBNAIL_GRID_COLS[Math.min(images.length, 4)];

  return (
    <div className="space-y-3">
      {/* Top Main Featured Image (Full 100% Width, 392px Height) */}
      <div
        className="relative h-72 sm:h-[392px] w-full rounded-2xl overflow-hidden shadow-sm border border-borderSubtle bg-navy-900 cursor-pointer group"
        onClick={() => currentMainImage && setLightboxImage(currentMainImage)}
      >
        {currentMainImage ? (
          <Image
            src={currentMainImage}
            alt={tourName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            placeholder="blur"
            blurDataURL={TOUR_IMAGE_BLUR}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: gradient || TOUR_GRADIENT_FALLBACK }}
          />
        )}
        <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />

        {/* Top-Left Category Badge */}
        <span className="absolute top-4 left-4 z-10 bg-navy-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {categoryName}
        </span>

        {/* Bottom-Right Photo Counter Badge */}
        {images.length > 0 && (
          <span className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md text-textStrong text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-cacao-600" />
            <span>{activeImageIndex + 1} / {images.length} ảnh</span>
          </span>
        )}
      </div>

      {/* Bottom Thumbnail Bar — only when there is more than one photo to switch between */}
      {images.length > 1 && (
        <div className={`grid gap-2.5 sm:gap-3 ${gridCols}`}>
          {images.slice(0, 4).map((thumb, idx) => {
            const isActive = idx === activeImageIndex;
            return (
              <button
                key={thumb}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                aria-label={`Xem ảnh ${idx + 1} của ${tourName}`}
                aria-pressed={isActive}
                className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-cacao-600 shadow-md scale-[1.02]'
                    : 'border-borderSubtle opacity-70 hover:opacity-100 hover:border-cacao-300'
                }`}
              >
                <Image
                  src={thumb}
                  alt={`${tourName} — ảnh ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 25vw, 240px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={TOUR_IMAGE_BLUR}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            aria-label="Đóng ảnh phóng to"
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-black/40 cursor-pointer z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh]">
            <Image
              src={lightboxImage}
              alt={tourName}
              fill
              sizes="100vw"
              className="object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
