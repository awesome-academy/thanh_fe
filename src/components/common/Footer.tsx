import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-textSubtle py-9 px-8 mt-16 border-t border-navy-800">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="w-[22px] h-[22px] rounded-md bg-cacao-500 block" />
          <span className="text-[15px] font-bold text-white tracking-tight">
            TripGo
          </span>
          <span className="text-xs text-textSubtle ml-2">
            © 2026 TripGo Travel JSC
          </span>
        </div>
        <div className="flex flex-wrap gap-6 text-[13px] text-textSubtle">
          <span className="cursor-default">Về TripGo</span>
          <span className="cursor-default">Liên hệ</span>
          <span className="cursor-default">Điều khoản</span>
          <span className="cursor-default">Chính sách hoàn huỷ</span>
        </div>
      </div>
    </footer>
  );
}
