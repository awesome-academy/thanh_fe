'use client';

import { useReviews } from '@/hooks/use-reviews';
import { Star, MessageSquare, ShieldCheck } from 'lucide-react';

interface TourReviewsSectionProps {
  tourId: string;
}

export default function TourReviewsSection({ tourId }: TourReviewsSectionProps) {
  const { data: reviews } = useReviews();

  // Filter reviews belonging strictly to this tour, fallback to top reviews if none specifically bound
  const tourReviews = (reviews || []).filter((r) => r.tourId === tourId);
  const displayReviews = tourReviews.length > 0 ? tourReviews : (reviews || []).slice(0, 3);

  const avgScore = displayReviews.length > 0
    ? (displayReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / displayReviews.length).toFixed(1)
    : '4.8';

  return (
    <div className="space-y-6 bg-surface-card border border-borderSubtle rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
        <h3 className="text-lg font-bold text-textStrong flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cacao-600" />
          <span>Đánh Giá Từ Khách Hàng</span>
        </h3>
        <div className="flex items-center gap-1 bg-cacao-50 px-3 py-1.5 rounded-xl border border-cacao-100">
          <Star className="w-4 h-4 text-status-star fill-current" />
          <span className="font-bold text-textStrong text-sm">{avgScore} / 5.0</span>
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {displayReviews.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-surface-page border border-borderSubtle space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cacao-600 text-white font-bold text-xs flex items-center justify-center">
                  {item.userInitials || item.userName[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-textStrong text-sm">{item.userName}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Đã đi tour
                    </span>
                  </div>
                  <span className="text-[11px] text-textSubtle">{item.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-status-star">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{(item.rating || 5.0).toFixed(1)}</span>
              </div>
            </div>
            <p className="text-xs text-textBody leading-relaxed italic">
              &quot;{item.comment}&quot;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
