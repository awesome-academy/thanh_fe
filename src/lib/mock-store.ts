import toursData from "@/data/mock/tours.json";
import reviewsData from "@/data/mock/reviews.json";
import bookingsData from "@/data/mock/bookings.json";
import usersData from "@/data/mock/users.json";
import { Tour, Review, Booking, User } from "@/types";

// Global Singleton pattern for Next.js dev server worker threads
const globalForMock = globalThis as unknown as {
  toursStore: Tour[];
  reviewsStore: Review[];
  bookingsStore: Booking[];
  userWishlistsStore: Record<string, string[]>;
  usersStore: User[];
};

export const toursStore = globalForMock.toursStore || [...(toursData as Tour[])];
export const reviewsStore = globalForMock.reviewsStore || [...(reviewsData as Review[])];
export const bookingsStore = globalForMock.bookingsStore || [...(bookingsData as Booking[])];
export const userWishlistsStore = globalForMock.userWishlistsStore || {
  u1: ["t1", "t3"],
  u2: ["t2"],
};
export const usersStore = globalForMock.usersStore || [...(usersData as User[])];

if (process.env.NODE_ENV !== "production") {
  globalForMock.toursStore = toursStore;
  globalForMock.reviewsStore = reviewsStore;
  globalForMock.bookingsStore = bookingsStore;
  globalForMock.userWishlistsStore = userWishlistsStore;
  globalForMock.usersStore = usersStore;
}
