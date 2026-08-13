import { NextRequest, NextResponse } from "next/server";
import { userWishlistsStore } from "@/lib/mock-store";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để xem danh sách yêu thích" } },
      { status: 401 }
    );
  }

  const userId = session.user.id || session.user.email || "default";
  const userWishlist = userWishlistsStore[userId] || [];

  return NextResponse.json({ tourIds: userWishlist });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để lưu yêu thích" } },
      { status: 401 }
    );
  }

  const userId = session.user.id || session.user.email || "default";
  if (!userWishlistsStore[userId]) {
    userWishlistsStore[userId] = [];
  }

  try {
    const { tourId } = await request.json();
    if (tourId && !userWishlistsStore[userId].includes(tourId)) {
      userWishlistsStore[userId].push(tourId);
    }
    return NextResponse.json({ tourIds: userWishlistsStore[userId] });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Yêu cầu không hợp lệ" } },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để thao tác yêu thích" } },
      { status: 401 }
    );
  }

  const userId = session.user.id || session.user.email || "default";
  if (!userWishlistsStore[userId]) {
    userWishlistsStore[userId] = [];
  }

  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId");

  if (!tourId) {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Thiếu tourId cần xóa" } },
      { status: 400 }
    );
  }

  const index = userWishlistsStore[userId].indexOf(tourId);
  if (index !== -1) {
    userWishlistsStore[userId].splice(index, 1);
  }

  return NextResponse.json({ tourIds: userWishlistsStore[userId] });
}
