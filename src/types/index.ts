export interface Tour {
  id: number;
  name: string;
  slug: string;
  dest: string;
  days: number;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  image?: string;
  itinerary?: { day: number; title: string; content: string }[];
}

export interface Booking {
  id: string;
  code: string;
  tourId: number;
  tourName: string;
  departDate: string;
  guests: { adults: number; kids: number };
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  contact: { name: string; email: string; phone: string; note?: string };
}

export interface Category {
  slug: string;
  name: string;
  tourCount?: number;
}
