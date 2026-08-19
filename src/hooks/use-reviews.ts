import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Review } from '@/types';
import { getUserInitials } from '@/lib/format';

export interface ReviewWithTour extends Review {
  tourName?: string;
}

export interface SubmitReviewPayload {
  rating: number;
  comment: string;
}

interface SubmitReviewContext {
  previous?: ReviewWithTour[];
}

export function useReviews() {
  return useQuery<ReviewWithTour[]>({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await fetch('/api/reviews');
      if (!res.ok) {
        throw new Error('Không thể tải danh sách đánh giá');
      }
      return res.json();
    },
  });
}

export function useSubmitReview(slug: string, tourId: string) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation<Review, Error, SubmitReviewPayload, SubmitReviewContext>({
    mutationFn: async (payload) => {
      const res = await fetch(`/api/tours/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || 'Gửi đánh giá thất bại');
      }
      return data;
    },

    onMutate: async (payload) => {
      // Cancel in-flight refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['reviews'] });

      // Snapshot current cache for rollback
      const previous = queryClient.getQueryData<ReviewWithTour[]>(['reviews']);

      // Mirror the server: the displayed author is the signed-in user.
      const authorName =
        session?.user?.name?.trim() || session?.user?.email?.split('@')[0] || 'Bạn';

      const optimistic: ReviewWithTour = {
        id: `optimistic-${Date.now()}`,
        tourId: tourId,
        userName: authorName,
        userInitials: getUserInitials(authorName),
        rating: payload.rating,
        comment: payload.comment.trim(),
        createdAt: new Date().toISOString().split('T')[0],
      };

      queryClient.setQueryData<ReviewWithTour[]>(['reviews'], (old) =>
        old ? [optimistic, ...old] : [optimistic]
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        // Restore previous snapshot if we had one
        queryClient.setQueryData(['reviews'], context.previous);
      } else {
        // Cache was empty before mutation; remove only the optimistic entry
        queryClient.setQueryData<ReviewWithTour[]>(['reviews'], (old) =>
          (old || []).filter((r) => !r.id.startsWith('optimistic-'))
        );
        queryClient.invalidateQueries({ queryKey: ['reviews'] });
      }
    },

    onSuccess: () => {
      // Replace optimistic entry with real server data
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
