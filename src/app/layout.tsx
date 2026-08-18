import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import AuthProvider from "@/components/providers/AuthProvider";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "TripGo – Travel Tour Booking",
  description: "Website đặt tour du lịch hàng đầu Việt Nam",
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-surface-page text-textBody antialiased">
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
