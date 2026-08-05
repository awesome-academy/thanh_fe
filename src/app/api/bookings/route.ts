import { NextRequest, NextResponse } from "next/server";
import { Booking, Tour } from "@/types";
import toursData from "@/data/mock/tours.json";
import { bookingsStore } from "@/lib/bookings-store";

export async function GET() {
  return NextResponse.json(bookingsStore);
}

export async function POST(request: NextRequest) {
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

    const tours = toursData as Tour[];
    const tour = tours.find((t) => t.id === tourId || t.slug === tourId);

    const tourPrice = tour ? tour.price : 4290000;
    const kidPrice = tour ? tour.kidPrice : 2990000;
    const totalPrice = adults * tourPrice + children * kidPrice;

    const newId = `b${bookingsStore.length + 1}`;
    const codeNum = String(bookingsStore.length + 124).padStart(6, "0");
    const code = `TG-2026-${codeNum}`;

    const newBooking: Booking = {
      id: newId,
      code,
      tourId: tour?.id || tourId || "t1",
      tourName: tour?.name || "Tour du lịch TripGo",
      tourDest: tour?.dest || "da-nang",
      departDate: date || "2026-07-05",
      adults: Number(adults),
      children: Number(children),
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
