import { NextRequest, NextResponse } from "next/server";
import { Review } from "@/types";
import reviewsData from "@/data/mock/reviews.json";

const reviewsStore: Review[] = [...(reviewsData as Review[])];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: tourId } = await params;
    const body = await request.json();
    const { userName, rating, comment } = body;

    if (!userName || !rating || !comment) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION",
            message: "Thiếu thông tin đánh giá",
            fields: {
              userName: !userName ? "Vui lòng nhập tên" : "",
              rating: !rating ? "Vui lòng chọn số sao" : "",
              comment: !comment ? "Vui lòng nhập nhận xét" : "",
            },
          },
        },
        { status: 422 }
      );
    }

    const nameParts = userName.trim().split(" ");
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : nameParts[0].slice(0, 2).toUpperCase();

    const newReview: Review = {
      id: `r${reviewsStore.length + 1}`,
      tourId,
      userName: userName.trim(),
      userInitials: initials,
      rating: Number(rating),
      comment: comment.trim(),
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
