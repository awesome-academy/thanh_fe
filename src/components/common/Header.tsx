'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useWishlistStore } from '@/stores/use-wishlist-store';
import { Button } from '@/components/ui/button';
import {
  getActiveHeaderNav,
  headerNavItems,
  type HeaderNavKey,
} from '@/components/common/header-navigation';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';

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
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const wishlistIds = useWishlistStore((state) => state.wishlistIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  const count = mounted ? wishlistIds.length : 0;
  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

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
            <Heart className="w-5 h-5 text-cacao-500" />
            <span className="bg-cacao-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full font-mono tabular-nums">
              {count}
            </span>
          </Link>

          {mounted && isAuthenticated && user ? (
            <div className="hidden sm:block relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-xs font-medium text-white hover:opacity-90 transition-opacity p-1 rounded-full border border-navy-700 bg-navy-800/80 cursor-pointer"
              >
                {user.avatar || user.image ? (
                  <img
                    src={user.avatar || user.image || ''}
                    alt={user.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-cacao-400"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-cacao-600 text-white font-bold text-xs flex items-center justify-center">
                    {userInitials}
                  </span>
                )}
                <span className="max-w-[110px] truncate pl-0.5">{user.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-textSubtle transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-borderSubtle rounded-2xl shadow-2xl py-2 z-50 text-textStrong text-xs space-y-1">
                  {/* User Profile Header Info */}
                  <div className="px-4 py-2.5 border-b border-borderSubtle space-y-0.5">
                    <p className="font-bold text-textStrong text-sm truncate">{user.name}</p>
                    <p className="text-[11px] text-textSubtle truncate">{user.email}</p>
                  </div>

                  {/* Menu Links */}
                  <Link
                    href="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-cacao-50/50 text-textBody hover:text-cacao-600 transition-colors font-medium"
                  >
                    <ShoppingBag className="w-4 h-4 text-cacao-500" />
                    <span>Đơn hàng của tôi</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-cacao-50/50 text-textBody hover:text-cacao-600 transition-colors font-medium"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Danh sách yêu thích</span>
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      href="/admin/tours"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-navy-50 text-navy-900 font-bold transition-colors border-t border-b border-borderSubtle my-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-cacao-600" />
                      <span>Trang quản trị Admin</span>
                    </Link>
                  )}

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 transition-colors font-medium cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
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
                <div className="px-3 py-1.5 text-xs text-textSubtle">
                  Tài khoản: <span className="font-bold text-white">{user.name}</span> ({user.role})
                </div>
                <Link
                  href="/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-white px-3 py-1.5 hover:bg-navy-800 rounded-md"
                >
                  Đơn hàng của tôi
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin/tours"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-bold text-cacao-400 px-3 py-1.5 hover:bg-navy-800 rounded-md"
                  >
                    Trang quản trị Admin
                  </Link>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full border-navy-700 text-slate-300 hover:bg-navy-800 mt-2"
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
