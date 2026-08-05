import { NextRequest, NextResponse } from "next/server";

let wishlistStore: string[] = ["t1", "t3"];

export async function GET() {
  return NextResponse.json({ tourIds: wishlistStore });
}

export async function POST(request: NextRequest) {
  try {
    const { tourId } = await request.json();
    if (tourId && !wishlistStore.includes(tourId)) {
      wishlistStore.push(tourId);
    }
    return NextResponse.json({ tourIds: wishlistStore });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Yêu cầu không hợp lệ" } },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId");

  if (tourId) {
    wishlistStore = wishlistStore.filter((id) => id !== tourId);
  }

  return NextResponse.json({ tourIds: wishlistStore });
}
