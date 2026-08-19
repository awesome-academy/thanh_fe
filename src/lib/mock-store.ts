import toursData from "@/data/mock/tours.json";
import reviewsData from "@/data/mock/reviews.json";
import bookingsData from "@/data/mock/bookings.json";
import usersData from "@/data/mock/users.json";
import { Tour, Review, Booking, StoredUser } from "@/types";

// Global Singleton pattern for Next.js dev server worker threads
const globalForMock = globalThis as unknown as {
  toursStore: Tour[];
  reviewsStore: Review[];
  bookingsStore: Booking[];
  usersStore: StoredUser[];
};

export const toursStore = globalForMock.toursStore || [...(toursData as Tour[])];
export const reviewsStore = globalForMock.reviewsStore || [...(reviewsData as Review[])];
export const bookingsStore = globalForMock.bookingsStore || [...(bookingsData as Booking[])];
export const usersStore = globalForMock.usersStore || [...(usersData as StoredUser[])];

if (process.env.NODE_ENV !== "production") {
  globalForMock.toursStore = toursStore;
  globalForMock.reviewsStore = reviewsStore;
  globalForMock.bookingsStore = bookingsStore;
  globalForMock.usersStore = usersStore;
}

/**
 * Next sequential ID for a mock store, e.g. nextMockId(reviewsStore, "r") → "r8".
 *
 * Derived from the highest numeric suffix in use, not from the array length:
 * `length + 1` collides after a delete, and admin tour delete both removes a
 * tour and cascades to its reviews.
 */
export function nextMockId<T extends { id: string }>(
  store: T[],
  prefix: string
): string {
  const highest = store.reduce((max, item) => {
    const n = Number(item.id.slice(prefix.length));
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `${prefix}${highest + 1}`;
}
