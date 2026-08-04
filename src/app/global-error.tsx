'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-md">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Đã xảy ra lỗi hệ thống</h2>
          <p className="text-sm text-slate-600 mb-6 font-mono bg-slate-100 p-3 rounded text-left overflow-auto max-h-32">
            {error.message || 'Vui lòng thử lại sau'}
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-[#0F6FBD] hover:bg-[#0B5A9C] text-white rounded-md text-sm font-medium transition-colors"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
