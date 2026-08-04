import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-surface-page">
      <h1 className="text-6xl font-bold text-cacao-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-textStrong mb-2">Trang không tồn tại</h2>
      <p className="text-sm text-textMuted mb-6 max-w-sm">
        Đường dẫn bạn tìm kiếm không hợp lệ hoặc đã bị dời sang địa chỉ khác.
      </p>
      <Link href="/">
        <Button className="bg-cacao-600 hover:bg-cacao-700 text-white font-medium">
          Trở về Trang chủ
        </Button>
      </Link>
    </div>
  );
}
