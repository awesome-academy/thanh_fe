import { useQuery } from "@tanstack/react-query";
import { Destination } from "@/types";

export function useDestinations() {
  return useQuery<Destination[]>({
    queryKey: ["destinations"],
    queryFn: async () => {
      const res = await fetch("/api/destinations");
      if (!res.ok) {
        throw new Error("Không thể tải danh sách điểm đến");
      }
      return res.json();
    },
  });
}
