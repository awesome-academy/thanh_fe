export interface Tour {
  id: string;
  slug: string;
  name: string;
  description: string;
  dest: string;
  days: number;
  price: number;
  kidPrice: number;
  rating: number;
  reviews: number;
  type: string;
  image?: string;
  images: string[];
  gradient?: string;
  highlights: string[];
  included: string[];
  excludes: string[];
  itinerary: { day: number; title: string; content: string }[];
}

export interface Destination {
  slug: string;
  name: string;
  tourCount: number;
  startingPrice: number;
  gradient: string;
}

export interface Category {
  slug: string;
  name: string;
  tourCount: number;
  icon?: string;
}

export interface Booking {
  id: string;
  code: string; // e.g. TG-2026-000123
  tourId: string;
  tourName: string;
  tourDest: string;
  departDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  paymentMethod: 'momo' | 'vnpay' | 'transfer' | 'card';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  contact: {
    fullName: string;
    email: string;
    phone: string;
    note?: string;
  };
}

export interface Review {
  id: string;
  tourId: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface WishlistResponse {
  tourIds: string[];
}

export interface APIValidationError {
  error: {
    code: 'VALIDATION';
    message: string;
    fields: Record<string, string>;
  };
}
