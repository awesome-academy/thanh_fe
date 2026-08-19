import { NextRequest, NextResponse } from 'next/server';
import { Tour } from '@/types';
import { toursStore, nextMockId } from '@/lib/mock-store';
import { requireAdmin } from '@/lib/admin-guard';
import { tourFormSchema, toFieldErrors } from '@/lib/tour-schema';
import { slugify, uniqueSlug } from '@/lib/slugify';

/**
 * Sort comparators. `newest` is absent on purpose — POST unshifts, so store
 * order already is newest-first and needs no comparator.
 */
const TOUR_SORTS: Record<string, (a: Tour, b: Tour) => number> = {
  name: (a, b) => a.name.localeCompare(b.name, 'vi'),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const dest = searchParams.get('dest') || '';
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'newest';
  const limit = Math.max(1, Number(searchParams.get('limit')) || 10);

  let filtered: Tour[] = toursStore;

  if (search) {
    filtered = filtered.filter(
      (t) => t.name.toLowerCase().includes(search) || t.slug.includes(search)
    );
  }
  if (dest) {
    filtered = filtered.filter((t) => t.dest === dest);
  }
  if (type) {
    filtered = filtered.filter((t) => t.type === type);
  }

  const comparator = TOUR_SORTS[sort];
  if (comparator) {
    filtered = [...filtered].sort(comparator);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(Math.max(1, Number(searchParams.get('page')) || 1), totalPages);
  const startIndex = (page - 1) * limit;

  return NextResponse.json({
    data: filtered.slice(startIndex, startIndex + limit),
    total,
    page,
    totalPages,
  });
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Yêu cầu không hợp lệ' } },
      { status: 400 }
    );
  }

  const parsed = tourFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(toFieldErrors(parsed.error), { status: 422 });
  }

  const values = parsed.data;
  const id = nextMockId(toursStore, 't');
  const nameSlug = slugify(values.name);

  const tour: Tour = {
    id,
    slug: uniqueSlug(
      nameSlug || `tour-${id}`,
      toursStore.map((t) => t.slug)
    ),
    name: values.name,
    description: values.description,
    dest: values.dest,
    days: values.days,
    price: values.price,
    kidPrice: values.kidPrice,
    rating: 0,
    reviews: 0,
    type: values.type,
    // image is a denormalized copy of images[0], derived rather than entered.
    image: values.images[0],
    images: values.images,
    highlights: values.highlights,
    included: values.included,
    excludes: values.excludes,
    itinerary: [],
  };

  toursStore.unshift(tour);

  return NextResponse.json(tour, { status: 201 });
}
