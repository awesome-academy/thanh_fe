import { NextRequest, NextResponse } from "next/server";
import { bookingsStore } from "@/lib/mock-store";
import { auth } from "@/auth";

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

  // Strict ownership verification:
  // 1. Admin always authorized
  // 2. If booking.userId exists, MUST match session.user.id ONLY
  // 3. Fallback to contact.email ONLY for legacy bookings without userId
  const isAdmin = session.user.role === "admin";
  let isAuthorized = isAdmin;

  if (!isAuthorized) {
    if (booking.userId) {
      isAuthorized = Boolean(session.user.id && booking.userId === session.user.id);
    } else if (session.user.email && booking.contact?.email) {
      isAuthorized = booking.contact.email.toLowerCase() === session.user.email.toLowerCase();
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      { error: { code: "FORBIDDEN", message: "Bạn không có quyền hủy đơn hàng này" } },
      { status: 403 }
    );
  }

  booking.status = "cancelled";

  return NextResponse.json(booking);
}
