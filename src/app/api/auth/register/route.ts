import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { usersStore } from "@/lib/mock-store";
import { StoredUser, User } from "@/types";

const registerSchema = z.object({
  name: z.string().min(2, "Họ và tên tối thiểu 2 ký tự"),
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      return NextResponse.json(
        { error: { code: "VALIDATION", message: firstIssue } },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();

    const existingUser = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: { code: "CONFLICT", message: "Email này đã được sử dụng cho tài khoản khác" } },
        { status: 409 }
      );
    }

    const newUser: StoredUser = {
      id: `u_${randomUUID()}`,
      name: name.trim(),
      email: cleanEmail,
      // TODO: hash password (bcrypt) khi chuyển sang DB thật — mock store đang lưu plaintext
      password,
      role: "user",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    };

    usersStore.push(newUser);

    const { password: _password, ...publicUser } = newUser;
    const user: User = publicUser;

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: { code: "BAD_REQUEST", message: "Yêu cầu không hợp lệ" } },
      { status: 400 }
    );
  }
}
