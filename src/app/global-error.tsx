'use client';

import React from 'react';
import '@/app/globals.css';

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
          <p className="text-sm text-slate-600 mb-4">
            Rất tiếc, hệ thống gặp sự cố không mong muốn. Vui lòng thử lại sau.
          </p>
          {error.digest && (
            <p className="error-digest text-xs text-slate-400 mb-6 font-mono">
              Mã lỗi: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-cacao-600 hover:bg-cacao-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
