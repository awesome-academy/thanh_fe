import { Booking } from "@/types";
import bookingsData from "@/data/mock/bookings.json";

// Shared In-Memory Bookings Store
export const bookingsStore: Booking[] = [...(bookingsData as Booking[])];
