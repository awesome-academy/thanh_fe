'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { TOUR_IMAGE_BLUR } from '@/lib/image-placeholder';

interface TourGalleryProps {
  images?: string[];
  gradient?: string;
  tourName: string;
  categoryName?: string;
}

export default function TourGallery({
  images = [],
  gradient,
  tourName,
  categoryName = 'BIỂN-ĐẢO',
}: TourGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  ];

  // Guarantee 4 thumbnail slots for full design compliance
  const thumbnails = [
    displayImages[0] || displayImages[0],
    displayImages[1] || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
    displayImages[2] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    displayImages[3] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  ];

  const currentMainImage = thumbnails[activeImageIndex] || displayImages[0];

  return (
    <div className="space-y-3">
      {/* Top Main Featured Image (Full 100% Width, 392px Height) */}
      <div
        className="relative h-72 sm:h-[392px] w-full rounded-2xl overflow-hidden shadow-sm border border-borderSubtle bg-navy-900 cursor-pointer group"
        onClick={() => setLightboxImage(currentMainImage)}
      >
        {currentMainImage ? (
          <Image
            src={currentMainImage}
            alt={tourName}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 80vw"
            placeholder="blur"
            blurDataURL={TOUR_IMAGE_BLUR}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: gradient || 'linear-gradient(135deg, #0F6FBD 0%, #137DD0 100%)' }}
          />
        )}
        <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />

        {/* Top-Left Category Badge */}
        <span className="absolute top-4 left-4 z-10 bg-navy-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
          {categoryName}
        </span>

        {/* Bottom-Right Photo Counter Badge */}
        <span className="absolute bottom-4 right-4 z-10 bg-white/90 backdrop-blur-md text-textStrong text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-cacao-600" />
          <span>{activeImageIndex + 1} / {thumbnails.length} ảnh</span>
        </span>
      </div>

      {/* Bottom Thumbnail Bar (4 Equal Grid Columns) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {thumbnails.map((thumb, idx) => {
          const isActive = idx === activeImageIndex;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImageIndex(idx)}
              className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-cacao-600 shadow-md scale-[1.02]'
                  : 'border-borderSubtle opacity-70 hover:opacity-100 hover:border-cacao-300'
              }`}
            >
              <Image
                src={thumb}
                alt={`${tourName} ảnh ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, 160px"
                placeholder="blur"
                blurDataURL={TOUR_IMAGE_BLUR}
              />
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full bg-black/40 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl w-full max-h-[85vh] aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={lightboxImage}
              alt={tourName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
