import { useQuery } from "@tanstack/react-query";
import { Review } from "@/types";

export interface ReviewWithTour extends Review {
  tourName?: string;
}

export function useReviews() {
  return useQuery<ReviewWithTour[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) {
        throw new Error("Không thể tải danh sách đánh giá");
      }
      return res.json();
    },
  });
}
