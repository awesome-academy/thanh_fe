import { NextRequest, NextResponse } from 'next/server';
import { toursStore, reviewsStore } from '@/lib/mock-store';
import { requireAdmin } from '@/lib/admin-guard';
import { tourFormSchema, toFieldErrors } from '@/lib/tour-schema';

function tourNotFound() {
  return NextResponse.json(
    { error: { code: 'NOT_FOUND', message: 'Không tìm thấy tour du lịch' } },
    { status: 404 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const { id } = await params;
  const index = toursStore.findIndex((t) => t.id === id);
  if (index === -1) return tourNotFound();

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
  const existing = toursStore[index];

  toursStore[index] = {
    ...existing,
    name: values.name,
    description: values.description,
    dest: values.dest,
    type: values.type,
    days: values.days,
    price: values.price,
    kidPrice: values.kidPrice,
    // image is a denormalized copy of images[0], derived rather than entered.
    image: values.images[0],
    images: values.images,
    highlights: values.highlights,
    included: values.included,
    excludes: values.excludes,
  };

  return NextResponse.json(toursStore[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const { id } = await params;
  const index = toursStore.findIndex((t) => t.id === id);
  if (index === -1) return tourNotFound();

  toursStore.splice(index, 1);

  // Cascade to reviews: an orphaned review would render under the generic
  // "Tour du lịch TripGo" fallback in GET /api/reviews. Bookings are left
  // alone — they denormalize tourName/tourDest and still display correctly.
  let deletedReviews = 0;
  for (let i = reviewsStore.length - 1; i >= 0; i -= 1) {
    if (reviewsStore[i].tourId === id) {
      reviewsStore.splice(i, 1);
      deletedReviews += 1;
    }
  }

  return NextResponse.json({ id, deletedReviews });
}
