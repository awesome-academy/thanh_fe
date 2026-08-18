import { NextRequest, NextResponse } from "next/server";
import { Tour } from "@/types";
import { toursStore, reviewsStore } from "@/lib/mock-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tours = toursStore;

  const tour = tours.find((t) => t.slug === slug || t.id === slug);

  if (!tour) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Không tìm thấy tour du lịch" } },
      { status: 404 }
    );
  }

  const tourReviews = reviewsStore.filter((r) => r.tourId === tour.id);

  return NextResponse.json({
    ...tour,
    reviewsList: tourReviews,
  });
}
