'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitReview } from '@/hooks/use-reviews';
import { Star, Send, CheckCircle2, AlertCircle, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Vui lòng chọn số sao').max(5),
  comment: z
    .string()
    .trim()
    .min(10, 'Nhận xét phải có ít nhất 10 ký tự')
    .max(500, 'Nhận xét tối đa 500 ký tự'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewSubmitFormProps {
  slug: string;
  tourId: string;
}

export default function ReviewSubmitForm({ slug, tourId }: ReviewSubmitFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, isError, error, reset: resetMutation } = useSubmitReview(slug, tourId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  const selectedRating = watch('rating');
  const commentValue = watch('comment');

  const onSubmit = (values: ReviewFormValues) => {
    if (!session) {
      router.push('/login');
      return;
    }

    mutate(values, {
      onSuccess: () => {
        setSubmitted(true);
        reset({ rating: 0, comment: '' });
        setTimeout(() => {
          setSubmitted(false);
          resetMutation();
        }, 4000);
      },
    });
  };

  const starLabels = ['', 'Tệ', 'Không tốt', 'Bình thường', 'Tốt', 'Xuất sắc'];

  return (
    <div className="bg-surface-card border border-borderSubtle rounded-2xl p-6 shadow-sm space-y-5">
      {/* Header */}
      <h3 className="text-base font-bold text-textStrong flex items-center gap-2 border-b border-borderSubtle pb-4">
        <PenLine className="w-4 h-4 text-cacao-600" />
        <span>Gửi Đánh Giá Của Bạn</span>
      </h3>

      {/* Success Banner */}
      {submitted && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Cảm ơn bạn đã gửi đánh giá! Nhận xét của bạn đã xuất hiện trong danh sách.
          </span>
        </div>
      )}

      {/* Error Banner */}
      {isError && (
        <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{error?.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.'}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-textBody block">Đánh giá với tên</span>
          <p className="w-full px-3 py-2.5 text-sm font-medium text-textStrong bg-surface-page border border-borderSubtle rounded-xl">
            {session?.user?.name || 'Bạn cần đăng nhập'}
          </p>
        </div>

        {/* Star Rating Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-textBody">
            Đánh giá của bạn <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = star <= (hoveredStar || selectedRating);
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setValue('rating', star, { shouldValidate: true })}
                  className="p-0.5 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                  aria-label={`${star} sao — ${starLabels[star]}`}
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      isActive
                        ? 'text-status-star fill-current'
                        : 'text-borderSubtle'
                    }`}
                  />
                </button>
              );
            })}
            {(hoveredStar || selectedRating) > 0 && (
              <span className="text-xs font-semibold text-cacao-600 ml-1">
                {starLabels[hoveredStar || selectedRating]}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.rating.message}</p>
          )}
        </div>

        {/* Comment Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-textBody">
            Nhận xét <span className="text-rose-500">*</span>
          </label>
          <textarea
            {...register('comment')}
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về chuyến đi này..."
            className="w-full px-3 py-2.5 text-sm text-textStrong bg-surface-page border border-borderSubtle rounded-xl focus:outline-none focus:ring-2 focus:ring-cacao-500/30 focus:border-cacao-500 transition-colors placeholder:text-textSubtle resize-none"
          />
          <div className="flex items-center justify-between">
            {errors.comment ? (
              <p className="text-[11px] text-rose-600 font-medium">{errors.comment.message}</p>
            ) : (
              <span />
            )}
            <span
              className={`text-[11px] tabular-nums ${
                commentValue.length > 450 ? 'text-rose-500 font-semibold' : 'text-textSubtle'
              }`}
            >
              {commentValue.length} / 500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-1 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-cacao-600 hover:bg-cacao-700 text-white font-bold rounded-xl px-6 flex items-center gap-2 shadow-sm"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{session ? 'Gửi đánh giá' : 'Đăng nhập để gửi'}</span>
              </>
            )}
          </Button>
        </div>

        {/* Unauthenticated hint */}
        {!session && (
          <p className="text-[11px] text-textMuted text-right">
            Bạn sẽ được chuyển đến trang đăng nhập khi bấm gửi.
          </p>
        )}
      </form>
    </div>
  );
}
