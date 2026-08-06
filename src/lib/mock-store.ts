import toursData from "@/data/mock/tours.json";
import reviewsData from "@/data/mock/reviews.json";
import bookingsData from "@/data/mock/bookings.json";
import { Tour, Review, Booking } from "@/types";

// Global Singleton pattern for Next.js dev server worker threads
const globalForMock = globalThis as unknown as {
  toursStore: Tour[];
  reviewsStore: Review[];
  bookingsStore: Booking[];
  wishlistStore: string[];
};

export const toursStore = globalForMock.toursStore || [...(toursData as Tour[])];
export const reviewsStore = globalForMock.reviewsStore || [...(reviewsData as Review[])];
export const bookingsStore = globalForMock.bookingsStore || [...(bookingsData as Booking[])];
export const wishlistStore = globalForMock.wishlistStore || ["t1", "t3"];

if (process.env.NODE_ENV !== "production") {
  globalForMock.toursStore = toursStore;
  globalForMock.reviewsStore = reviewsStore;
  globalForMock.bookingsStore = bookingsStore;
  globalForMock.wishlistStore = wishlistStore;
}
