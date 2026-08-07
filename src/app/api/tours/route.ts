import { NextRequest, NextResponse } from "next/server";
import { Tour } from "@/types";
import toursData from "@/data/mock/tours.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.toLowerCase().trim() || "";
  const dest = searchParams.get("dest") || "";
  const type = searchParams.get("type") || "";
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 0;
  const duration = Number(searchParams.get("duration")) || 0;
  const minRating = Number(searchParams.get("minRating")) || 0;
  const sort = searchParams.get("sort") || "recommended";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || 6);

  let filtered: Tour[] = toursData as Tour[];

  // Keyword search
  if (search) {
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(search) ||
        t.dest.toLowerCase().includes(search)
    );
  }

  // Destination filter
  if (dest) {
    filtered = filtered.filter((t) => t.dest === dest);
  }

  // Category filter
  if (type) {
    filtered = filtered.filter((t) => t.type === type);
  }

  // Price range filter
  if (minPrice > 0 || maxPrice > 0) {
    filtered = filtered.filter(
      (t) => t.price >= minPrice && (maxPrice === 0 || t.price <= maxPrice)
    );
  }

  // Duration filter
  if (duration > 0) {
    filtered = filtered.filter((t) => (duration === 4 ? t.days >= 4 : t.days === duration));
  }

  // Rating filter
  if (minRating > 0) {
    filtered = filtered.filter((t) => t.rating >= minRating);
  }

  // Sorting
  if (sort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    data: paginated,
    total,
    page,
    totalPages,
  });
}
