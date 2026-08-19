import { NextRequest, NextResponse } from "next/server";
import { bookingsStore } from "@/lib/mock-store";
import { auth } from "@/auth";
import { isBookingOwner } from "@/lib/booking-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để hủy đơn hàng" } },
      { status: 401 }
    );
  }

  const { id } = await params;
  const booking = bookingsStore.find((b) => b.id === id || b.code === id);

  if (!booking) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Không tìm thấy đơn hàng" } },
      { status: 404 }
    );
  }

  if (!isBookingOwner(booking, session.user)) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Bạn không có quyền hủy đơn hàng này" } },
      { status: 403 }
    );
  }

  booking.status = "cancelled";

  return NextResponse.json(booking);
}
