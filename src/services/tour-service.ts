import { Tour, Destination } from '@/types';
import toursData from '@/data/mock/tours.json';
import destinationsData from '@/data/mock/destinations.json';

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const tours = toursData as Tour[];
  const tour = tours.find((t) => t.slug === slug || t.id === slug);
  return tour || null;
}

export async function getDestinationsMap(): Promise<Record<string, string>> {
  const destinations = destinationsData as Destination[];
  return Object.fromEntries(destinations.map((d) => [d.slug, d.name]));
}
