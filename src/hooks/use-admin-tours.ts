import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Tour } from '@/types';
import { TourFormValues } from '@/lib/tour-schema';

const ADMIN_TOURS_URL = '/api/admin/tours';

export interface AdminTourQuery {
  search?: string;
  dest?: string;
  type?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface AdminToursResponse {
  data: Tour[];
  total: number;
  page: number;
  totalPages: number;
}

/** Carries the server's 422 field map so the form can map it back onto inputs. */
export interface AdminTourError extends Error {
  fields?: Record<string, string>;
}

async function readError(res: Response, fallback: string): Promise<AdminTourError> {
  const data = await res.json().catch(() => ({}));
  const error = new Error(data?.error?.message || fallback) as AdminTourError;
  if (data?.error?.fields) {
    error.fields = data.error.fields;
  }
  return error;
}

/**
 * Invalidate every cache that can show a tour.
 *
 * useTours keys on ['tours', queryString] and useTourDetail on
 * ['tour', slug]; both are prefix-matched by these calls.
 */
function useInvalidateTourCaches() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
    queryClient.invalidateQueries({ queryKey: ['tours'] });
    queryClient.invalidateQueries({ queryKey: ['tour'] });
  };
}

export function useAdminTours(query: AdminTourQuery = {}) {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.dest) params.set('dest', query.dest);
  if (query.type) params.set('type', query.type);
  if (query.sort) params.set('sort', query.sort);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));

  const queryString = params.toString();

  return useQuery<AdminToursResponse>({
    queryKey: ['admin-tours', queryString],
    queryFn: async () => {
      const res = await fetch(`${ADMIN_TOURS_URL}?${queryString}`);
      if (!res.ok) {
        throw await readError(res, 'Không thể tải danh sách tour');
      }
      return res.json();
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateTour() {
  const invalidate = useInvalidateTourCaches();

  return useMutation<Tour, AdminTourError, TourFormValues>({
    mutationFn: async (values) => {
      const res = await fetch(ADMIN_TOURS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        throw await readError(res, 'Tạo tour thất bại');
      }
      return res.json();
    },
    onSuccess: invalidate,
  });
}

export function useUpdateTour() {
  const invalidate = useInvalidateTourCaches();

  return useMutation<Tour, AdminTourError, { id: string; values: TourFormValues }>({
    mutationFn: async ({ id, values }) => {
      const res = await fetch(`${ADMIN_TOURS_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        throw await readError(res, 'Cập nhật tour thất bại');
      }
      return res.json();
    },
    onSuccess: invalidate,
  });
}

export function useDeleteTour() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateTourCaches();

  return useMutation<{ id: string; deletedReviews: number }, AdminTourError, string>({
    mutationFn: async (id) => {
      const res = await fetch(`${ADMIN_TOURS_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw await readError(res, 'Xóa tour thất bại');
      }
      return res.json();
    },
    onSuccess: () => {
      invalidate();
      // Delete cascades server-side, so the reviews list is stale too.
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
