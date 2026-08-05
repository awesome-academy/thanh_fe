import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "TripGo – Travel Tour Booking",
  description: "Website đặt tour du lịch hàng đầu Việt Nam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-surface-page text-textBody antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
