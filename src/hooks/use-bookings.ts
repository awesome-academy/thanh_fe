import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking } from "@/types";

export interface CreateBookingPayload {
  tourId: string;
  date: string;
  adults: number;
  children: number;
  paymentMethod?: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    note?: string;
  };
}

export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) {
        throw new Error("Không thể tải lịch sử đơn hàng");
      }
      return res.json();
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CreateBookingPayload>({
    mutationFn: async (payload) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data?.error) {
          throw new Error(data.error.message || "Dữ liệu không hợp lệ");
        }
        throw new Error("Tạo đơn hàng thất bại");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export interface CancelBookingPayload {
  id: string;
  reason: string;
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CancelBookingPayload>({
    mutationFn: async ({ id, reason }) => {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error?.message || "Hủy đơn hàng thất bại");
      }
      return res.json();
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["bookings"] });
      const previous = queryClient.getQueryData<Booking[]>(["bookings"]);
      queryClient.setQueryData<Booking[]>(["bookings"], (old) =>
        old ? old.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)) : []
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      const ctx = context as { previous?: Booking[] } | undefined;
      if (ctx?.previous) {
        queryClient.setQueryData(["bookings"], ctx.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
