import { NextRequest, NextResponse } from "next/server";
import { bookingsStore } from "@/lib/mock-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const booking = bookingsStore.find((b) => b.id === id || b.code === id);

  if (!booking) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Không tìm thấy đơn hàng" } },
      { status: 404 }
    );
  }

  booking.status = "cancelled";

  return NextResponse.json(booking);
}
