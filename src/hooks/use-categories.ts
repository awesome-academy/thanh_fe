import { useQuery } from "@tanstack/react-query";
import { Category } from "@/types";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error("Không thể tải danh mục tour");
      }
      return res.json();
    },
  });
}
