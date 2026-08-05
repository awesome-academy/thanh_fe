import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-page text-textBody">
      <header className="min-h-[64px] bg-navy-900 text-white flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 sticky top-0 z-40">
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-[26px] h-[26px] rounded-[7px] bg-cacao-500 block" />
            <span className="text-[19px] font-bold text-white tracking-tight">
              TripGo
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/tours" className="text-cacao-50 hover:text-white transition-colors">
              Tour
            </Link>
            <Link href="/tours?dest=da-nang" className="text-textSubtle hover:text-white transition-colors">
              Điểm đến
            </Link>
            <Link href="/tours?sort=discount" className="text-textSubtle hover:text-white transition-colors">
              Ưu đãi
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/wishlist"
            className="flex items-center gap-1.5 text-xs text-textSubtle hover:text-white transition-colors"
            aria-label="Tour yêu thích"
            title="Tour yêu thích"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            <span className="font-mono tabular-nums">0</span>
          </Link>
          <Link href="/login">
            <Button size="sm" className="bg-cacao-600 hover:bg-cacao-700 text-white font-medium">
              Đăng nhập
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-navy-900 text-textSubtle py-9 px-8 mt-16">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-[22px] h-[22px] rounded-md bg-cacao-500 block" />
            <span className="text-[15px] font-bold text-white">TripGo</span>
            <span className="text-xs text-textSubtle ml-2">
              © 2026 TripGo Travel JSC
            </span>
          </div>
          <div className="flex gap-6 text-textSubtle">
            <span>Về TripGo</span>
            <span>Liên hệ</span>
            <span>Điều khoản</span>
            <span>Chính sách hoàn huỷ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
