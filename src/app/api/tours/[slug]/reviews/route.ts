import { NextRequest, NextResponse } from "next/server";
import { Review } from "@/types";
import { toursStore, reviewsStore } from "@/lib/mock-store";
import { getUserInitials } from "@/lib/format";
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

    const authorName =
      session.user.name?.trim() || session.user.email?.split("@")[0].trim() || "";

    if (!authorName) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Phiên đăng nhập không hợp lệ" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    const trimmedComment = typeof comment === 'string' ? comment.trim() : '';
    const parsedRating = Number(rating);
    const isValidRating = Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5;

    if (!isValidRating || !trimmedComment) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION",
            message: "Thiếu thông tin đánh giá",
            fields: {
              rating: !isValidRating ? "Vui lòng chọn số sao (1-5)" : "",
              comment: !trimmedComment ? "Vui lòng nhập nhận xét" : "",
            },
          },
        },
        { status: 422 }
      );
    }

    const newReview: Review = {
      id: `r_${crypto.randomUUID()}`,
      tourId: tour.id,
      userName: authorName,
      userInitials: getUserInitials(authorName),
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
