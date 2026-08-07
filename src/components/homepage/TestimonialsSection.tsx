'use client';

import React from 'react';
import { useReviews } from '@/hooks/use-reviews';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const { data: reviews, isLoading } = useReviews();

  const featuredReviews = reviews?.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <p className="text-xs font-bold text-cacao-600 uppercase tracking-widest">Ý Kiến Khách Hàng</p>
        <h2 className="text-2xl sm:text-4xl font-bold text-textStrong">Được Tin Tưởng Bởi Hơn 50,000+ Du Khách</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-surface-card rounded-2xl h-52 animate-pulse border border-borderSubtle" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredReviews?.map((rev) => (
            <div
              key={rev.id}
              className="bg-surface-card border border-borderSubtle rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-status-star">
                    {[...Array(rev.rating)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-cacao-100" />
                </div>
                <p className="text-sm text-textBody leading-relaxed italic line-clamp-3">"{rev.comment}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-borderSubtle mt-4">
                <div className="w-10 h-10 rounded-full bg-cacao-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {rev.userInitials}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-textStrong truncate">{rev.userName}</h4>
                  <p className="text-xs text-textSubtle truncate">{rev.tourName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
