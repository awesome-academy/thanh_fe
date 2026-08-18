import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { usersStore } from "@/lib/mock-store";
import authConfig from "@/auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();
        const password = String(credentials.password);

        // TODO: hash password (bcrypt) khi chuyển sang DB thật — mock store đang lưu plaintext
        const user = usersStore.find(
          (u) => u.email.toLowerCase() === email && u.password === password
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],
});
