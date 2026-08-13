import { NextRequest, NextResponse } from "next/server";
import { Booking } from "@/types";
import { toursStore, bookingsStore } from "@/lib/mock-store";
import { auth } from "@/auth";

function isBookingOwner(
  booking: Booking,
  user: { id?: string; email?: string | null; role?: string }
): boolean {
  if (user.role === "admin") return true;

  if (booking.userId) {
    return Boolean(user.id && booking.userId === user.id);
  }

  if (user.email && booking.contact?.email) {
    return booking.contact.email.toLowerCase() === user.email.toLowerCase();
  }

  return false;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để xem đơn hàng" } },
      { status: 401 }
    );
  }

  if (session.user.role === "admin") {
    return NextResponse.json(bookingsStore);
  }

  const userBookings = bookingsStore.filter((b) => isBookingOwner(b, session.user));

  return NextResponse.json(userBookings);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để tạo đơn hàng" } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { tourId, date, adults = 1, children = 0, paymentMethod = "momo", contact } = body;

    const fields: Record<string, string> = {};

    if (!contact?.fullName?.trim()) {
      fields.fullName = "Họ và tên không được để trống";
    }

    if (!contact?.email?.includes("@")) {
      fields.email = "Email không hợp lệ";
    }

    const phoneClean = contact?.phone?.replace(/\s+/g, "") || "";
    if (!/^[0-9]{9,11}$/.test(phoneClean)) {
      fields.phone = "Số điện thoại không hợp lệ";
    }

    if (Object.keys(fields).length > 0) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION",
            message: "Dữ liệu không hợp lệ",
            fields,
          },
        },
        { status: 422 }
      );
    }

    const tour = toursStore.find((t) => t.id === tourId || t.slug === tourId);
    if (!tour) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Tour không tồn tại" } },
        { status: 404 }
      );
    }

    const numAdults = Number(adults) || 1;
    const numChildren = Number(children) || 0;
    const tourPrice = tour.price;
    const kidPrice = tour.kidPrice;
    const totalPrice = numAdults * tourPrice + numChildren * kidPrice;

    const newId = `b${bookingsStore.length + 1}`;
    const codeNum = String(bookingsStore.length + 124).padStart(6, "0");
    const code = `TG-2026-${codeNum}`;

    const newBooking: Booking = {
      id: newId,
      userId: session.user.id,
      code,
      tourId: tour.id,
      tourName: tour.name,
      tourDest: tour.dest,
      departDate: date || "2026-07-05",
      adults: numAdults,
      children: numChildren,
      totalPrice,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
      contact: {
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        note: contact.note || "",
      },
    };

    bookingsStore.unshift(newBooking);

    return NextResponse.json(newBooking, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Yêu cầu không hợp lệ" } },
      { status: 400 }
    );
  }
}
