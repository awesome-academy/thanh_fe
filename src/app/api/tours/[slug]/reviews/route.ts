import { NextRequest, NextResponse } from "next/server";
import { Review } from "@/types";
import { toursStore, reviewsStore, nextMockId } from "@/lib/mock-store";
import { auth } from "@/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập để gửi đánh giá" } },
        { status: 401 }
      );
    }

    const { slug } = await params;

    const tour = toursStore.find((t) => t.slug === slug || t.id === slug);
    if (!tour) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Không tìm thấy tour du lịch" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { userName, rating, comment } = body;

    const trimmedName = typeof userName === 'string' ? userName.trim() : '';
    const trimmedComment = typeof comment === 'string' ? comment.trim() : '';
    const parsedRating = Number(rating);
    const isValidRating = Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5;

    if (!trimmedName || !isValidRating || !trimmedComment) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION",
            message: "Thiếu thông tin đánh giá",
            fields: {
              userName: !trimmedName ? "Vui lòng nhập tên" : "",
              rating: !isValidRating ? "Vui lòng chọn số sao (1-5)" : "",
              comment: !trimmedComment ? "Vui lòng nhập nhận xét" : "",
            },
          },
        },
        { status: 422 }
      );
    }

    const nameParts = trimmedName.split(" ");
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : nameParts[0].slice(0, 2).toUpperCase();

    const newReview: Review = {
      id: nextMockId(reviewsStore, "r"),
      tourId: tour.id,
      userName: trimmedName,
      userInitials: initials,
      rating: parsedRating,
      comment: trimmedComment,
      createdAt: new Date().toISOString().split("T")[0],
    };

    reviewsStore.unshift(newReview);

    return NextResponse.json(newReview, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Yêu cầu không hợp lệ" } },
      { status: 400 }
    );
  }
}
