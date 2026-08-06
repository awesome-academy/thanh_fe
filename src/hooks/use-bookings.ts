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

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, string>({
    mutationFn: async (bookingId) => {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Hủy đơn hàng thất bại");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
