import { NextResponse } from "next/server";
import { reviewsStore, toursStore } from "@/lib/mock-store";

export async function GET() {
  const reviewsWithTour = reviewsStore.map((r) => {
    const tour = toursStore.find((t) => t.id === r.tourId);
    return {
      ...r,
      tourName: tour?.name || "Tour du lịch TripGo",
    };
  });

  return NextResponse.json(reviewsWithTour);
}
