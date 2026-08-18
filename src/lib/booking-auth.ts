import { Booking } from "@/types";

/** Identity fields an authorization check needs from the session user. */
export interface BookingAuthUser {
  id?: string;
  email?: string | null;
  role?: string;
}

export function isBookingOwner(booking: Booking, user: BookingAuthUser): boolean {
  if (user.role === "admin") return true;

  if (booking.userId) {
    return Boolean(user.id && booking.userId === user.id);
  }

  if (user.email && booking.contact?.email) {
    return booking.contact.email.toLowerCase() === user.email.toLowerCase();
  }

  return false;
}
