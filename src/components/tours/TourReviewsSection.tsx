'use client';

import { useReviews } from '@/hooks/use-reviews';
import ReviewSubmitForm from '@/components/tours/ReviewSubmitForm';
import { Star, MessageSquare } from 'lucide-react';

interface TourReviewsSectionProps {
  tourId: string;
  slug: string;
  rating: number;
}

export default function TourReviewsSection({ tourId, slug, rating }: TourReviewsSectionProps) {
  const { data: reviews } = useReviews();

  // Only reviews bound to this tour — never borrow another tour's reviews
  const tourReviews = (reviews || []).filter((r) => r.tourId === tourId);

  return (
    <div className="space-y-6">
      <div className="space-y-6 bg-surface-card border border-borderSubtle rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-borderSubtle">
          <h3 className="text-lg font-bold text-textStrong flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cacao-600" />
            <span>Đánh Giá Từ Khách Hàng</span>
          </h3>
          <div className="flex items-center gap-1 bg-cacao-50 px-3 py-1.5 rounded-xl border border-cacao-100">
            <Star className="w-4 h-4 text-status-star fill-current" />
            <span className="font-bold text-textStrong text-sm">{rating.toFixed(1)} / 5.0</span>
          </div>
        </div>

        {tourReviews.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-textSubtle/40 mx-auto" />
            <p className="text-sm font-semibold text-textStrong">Tour này chưa có đánh giá</p>
            <p className="text-xs text-textSubtle">
              Hãy là người đầu tiên chia sẻ trải nghiệm sau khi hoàn thành chuyến đi.
            </p>
          </div>
        ) : (
          /* Review Cards List */
          <div className="space-y-4">
            {tourReviews.map((item) => (
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
                      <span className="font-bold text-textStrong text-sm">{item.userName}</span>
                      <span className="text-[11px] text-textSubtle">{item.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-status-star">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{(item.rating || 5.0).toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-textBody leading-relaxed italic">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Form */}
      <ReviewSubmitForm slug={slug} tourId={tourId} />
    </div>
  );
}
