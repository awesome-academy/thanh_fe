import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Tour } from "@/types";

export interface TourQueryParams {
  ids?: string[];
  search?: string;
  dest?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ToursResponse {
  data: Tour[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * @param enabled
 */
export function useTours(params?: TourQueryParams, enabled = true) {
  const queryParams = new URLSearchParams();
  if (params?.ids) queryParams.set("ids", params.ids.join(","));
  if (params?.search) queryParams.set("search", params.search);
  if (params?.dest) queryParams.set("dest", params.dest);
  if (params?.type) queryParams.set("type", params.type);
  if (params?.minPrice && params.minPrice > 0)
    queryParams.set("minPrice", String(params.minPrice));
  if (params?.maxPrice && params.maxPrice > 0)
    queryParams.set("maxPrice", String(params.maxPrice));
  if (params?.duration) queryParams.set("duration", String(params.duration));
  if (params?.minRating) queryParams.set("minRating", String(params.minRating));
  if (params?.sort) queryParams.set("sort", params.sort);
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));

  const queryString = queryParams.toString();

  return useQuery<ToursResponse>({
    queryKey: ["tours", queryString],
    queryFn: async () => {
      const res = await fetch(`/api/tours?${queryString}`);
      if (!res.ok) {
        throw new Error("Không thể tải danh sách tour");
      }
      return res.json();
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
