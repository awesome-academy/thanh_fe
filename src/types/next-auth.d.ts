import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    role?: "user" | "admin";
    avatar?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: "user" | "admin";
      avatar?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "user" | "admin";
    avatar?: string;
  }
}
