import type { Metadata } from 'next';
import React from "react";

export const metadata: Metadata = {
  title: 'Tài khoản | TripGo',
  description:
    'Đăng nhập hoặc tạo tài khoản TripGo để đặt tour và quản lý chuyến đi của bạn.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page p-6">
      <div className="w-full max-w-md bg-surface-card p-8 rounded-xl border border-borderSubtle shadow-md">
        {children}
      </div>
    </div>
  );
}
