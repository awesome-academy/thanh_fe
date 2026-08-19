import { Tour, Destination } from '@/types';
import { toursStore } from '@/lib/mock-store';
import destinationsData from '@/data/mock/destinations.json';

export function getTourBySlug(slug: string): Tour | null {
  const tour = toursStore.find((t) => t.slug === slug || t.id === slug);
  return tour || null;
}

export function getDestinationsMap(): Record<string, string> {
  const destinations = destinationsData as Destination[];
  return Object.fromEntries(destinations.map((d) => [d.slug, d.name]));
}
