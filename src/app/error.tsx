'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold text-textStrong mb-2">Đã có lỗi xảy ra khi tải trang</h2>
      <p className="text-sm text-textMuted mb-4 max-w-md">
        Rất tiếc, đã xảy ra sự cố không mong muốn. Vui lòng thử lại hoặc quay lại trang chủ.
      </p>
      {error.digest && (
        <p className="text-xs text-textMuted/60 mb-6 font-mono">
          Mã lỗi: {error.digest}
        </p>
      )}
      <Button onClick={() => reset()} className="bg-cacao-600 hover:bg-cacao-700 text-white">
        Thử lại
      </Button>
    </div>
  );
}
