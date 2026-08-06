import { useQuery } from "@tanstack/react-query";
import { Tour, Review } from "@/types";

export interface TourDetailResponse extends Tour {
  reviewsList: Review[];
}

export function useTourDetail(slug: string) {
  return useQuery<TourDetailResponse>({
    queryKey: ["tour", slug],
    queryFn: async () => {
      const res = await fetch(`/api/tours/${slug}`);
      if (!res.ok) {
        throw new Error("Không tìm thấy thông tin tour");
      }
      return res.json();
    },
    enabled: Boolean(slug),
  });
}
