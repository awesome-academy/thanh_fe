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
      <p className="text-sm text-textMuted mb-6 max-w-md font-mono bg-slate-100 p-3 rounded text-left overflow-auto max-h-32">
        {error.message || 'Vui lòng thử lại sau'}
      </p>
      <Button onClick={() => reset()} className="bg-cacao-600 hover:bg-cacao-700 text-white">
        Thử lại
      </Button>
    </div>
  );
}
