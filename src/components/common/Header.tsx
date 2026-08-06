'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useWishlistStore } from '@/stores/use-wishlist-store';
import { useAuthStore } from '@/stores/use-auth-store';
import { Button } from '@/components/ui/button';
import {
  getActiveHeaderNav,
  headerNavItems,
  type HeaderNavKey,
} from '@/components/common/header-navigation';

interface HeaderNavContentProps {
  activeKey: HeaderNavKey | null;
  mobile?: boolean;
  onNavigate?: () => void;
}

function HeaderNavContent({
  activeKey,
  mobile = false,
  onNavigate,
}: HeaderNavContentProps) {
  return (
    <nav
      className={
        mobile
          ? 'space-y-2'
          : 'hidden md:flex items-center gap-6 text-sm font-medium'
      }
    >
      {headerNavItems.map((item) => {
        const isActive = activeKey === item.key;
        const className = mobile
          ? isActive
            ? 'block text-sm font-semibold text-white bg-navy-800/80 px-3 py-2 rounded-md border-l-4 border-cacao-500'
            : 'block text-sm font-medium text-textSubtle hover:text-white px-3 py-2 transition-colors'
          : isActive
            ? 'text-white font-semibold relative after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[2px] after:bg-cacao-500'
            : 'text-textSubtle hover:text-white transition-colors';

        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? 'page' : undefined}
            className={className}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function HeaderNavLinks({
  mobile = false,
  onNavigate,
}: Omit<HeaderNavContentProps, 'activeKey'>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeKey = getActiveHeaderNav(pathname, searchParams);

  return (
    <HeaderNavContent
      activeKey={activeKey}
      mobile={mobile}
      onNavigate={onNavigate}
    />
  );
}

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const wishlistIds = useWishlistStore((state) => state.wishlistIds);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const count = mounted ? wishlistIds.length : 0;

  return (
    <header className="min-h-[64px] bg-navy-900 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between min-h-[64px]">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-[26px] h-[26px] rounded-[7px] bg-cacao-500 block transition-transform group-hover:scale-105" />
            <span className="text-[19px] font-bold text-white tracking-tight">
              TripGo
            </span>
          </Link>
          <Suspense fallback={<HeaderNavContent activeKey={null} />}>
            <HeaderNavLinks />
          </Suspense>
        </div>

        {/* Desktop Actions & Mobile Menu Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/wishlist"
            className="flex items-center gap-1.5 text-[13px] text-textSubtle hover:text-white transition-colors relative"
            title="Tour yêu thích"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-cacao-500"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            <span className="bg-cacao-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full font-mono tabular-nums">
              {count}
            </span>
          </Link>

          {mounted && isAuthenticated && user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/bookings"
                className="text-xs text-textSubtle hover:text-white"
              >
                Đơn hàng
              </Link>
              <span className="text-xs font-medium text-white max-w-[100px] truncate">
                {user.name}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={logout}
                className="text-xs border-navy-700 text-textSubtle hover:text-white hover:bg-navy-800"
              >
                Đăng xuất
              </Button>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-block">
              <Button
                size="sm"
                className="bg-cacao-600 hover:bg-cacao-700 text-white font-medium shadow-sm"
              >
                Đăng nhập
              </Button>
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-textSubtle hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-950 border-t border-navy-800 px-4 py-4 space-y-3">
          <Suspense
            fallback={<HeaderNavContent activeKey={null} mobile />}
          >
            <HeaderNavLinks
              mobile
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </Suspense>

          <div className="pt-2 border-t border-navy-800">
            {mounted && isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  href="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-white py-1.5"
                >
                  Đơn hàng của tôi ({user.name})
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full border-navy-700 text-slate-300 hover:bg-navy-800"
                >
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-cacao-600 hover:bg-cacao-700 text-white font-medium mt-1">
                  Đăng nhập
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
