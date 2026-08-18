import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Booking } from "@/types";
import { toursStore, bookingsStore } from "@/lib/mock-store";
import { getBusinessToday } from "@/lib/format";
import { auth } from "@/auth";
import { isBookingOwner } from "@/lib/booking-auth";

const MAX_GUESTS_PER_TYPE = 20;

const bookingSchema = z.object({
  tourId: z.string().min(1, "Thiếu thông tin tour"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày khởi hành không đúng định dạng")
    .refine((value) => value >= getBusinessToday(), {
      message: "Ngày khởi hành không được ở quá khứ",
    }),
  adults: z.number().int().min(1, "Cần tối thiểu 1 người lớn").max(MAX_GUESTS_PER_TYPE),
  children: z.number().int().min(0).max(MAX_GUESTS_PER_TYPE),
  paymentMethod: z.enum(["momo", "vnpay", "transfer", "card"], {
    message: "Phương thức thanh toán không hợp lệ",
  }),
  contact: z.object({
    fullName: z.string().trim().min(1, "Họ và tên không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
      .string()
      .transform((value) => value.replace(/\s+/g, ""))
      .refine((value) => /^[0-9]{9,11}$/.test(value), "Số điện thoại không hợp lệ"),
    note: z.string().optional(),
  }),
});

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
    const parsed = bookingSchema.safeParse(await request.json());

    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[issue.path.length - 1] ?? "form");
        fields[field] ??= issue.message;
      }

      return NextResponse.json(
        {
          error: {
            code: "VALIDATION",
            message: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ",
            fields,
          },
        },
        { status: 422 }
      );
    }

    const { tourId, date, adults, children, paymentMethod, contact } = parsed.data;

    const tour = toursStore.find((t) => t.id === tourId || t.slug === tourId);
    if (!tour) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Tour không tồn tại" } },
        { status: 404 }
      );
    }

    const totalPrice = adults * tour.price + children * tour.kidPrice;

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
      departDate: date,
      adults,
      children,
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
