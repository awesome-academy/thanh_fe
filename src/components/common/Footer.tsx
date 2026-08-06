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
          <Link href="/about" className="hover:text-white transition-colors">
            Về TripGo
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            Liên hệ
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Điều khoản
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Chính sách hoàn huỷ
          </Link>
        </div>
      </div>
    </footer>
  );
}
