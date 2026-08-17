import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Review } from '@/types';

export interface ReviewWithTour extends Review {
  tourName?: string;
}

export interface SubmitReviewPayload {
  userName: string;
  rating: number;
  comment: string;
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

  return useMutation<Review, Error, SubmitReviewPayload>({
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

      // Build optimistic review object
      const nameParts = payload.userName.trim().split(' ');
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
          : nameParts[0].slice(0, 2).toUpperCase();

      const optimistic: ReviewWithTour = {
        id: `optimistic-${Date.now()}`,
        tourId: tourId,
        userName: payload.userName.trim(),
        userInitials: initials,
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
      const ctx = context as { previous?: ReviewWithTour[] } | undefined;
      if (ctx?.previous !== undefined) {
        // Restore previous snapshot if we had one
        queryClient.setQueryData(['reviews'], ctx.previous);
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
