import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
