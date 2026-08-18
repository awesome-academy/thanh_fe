'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Map, LogOut, ExternalLink } from 'lucide-react';

const ADMIN_NAV = [{ href: '/admin/tours', label: 'Quản lý Tour', icon: Map }];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-navy-900 text-white h-screen sticky top-0 flex flex-col shrink-0">
      <div className="p-6 font-bold text-lg border-b border-white/10">TripGo Admin</div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-white/15 font-semibold text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        {session?.user && (
          <div className="px-1">
            <p className="text-sm font-semibold text-white truncate">{session.user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{session.user.email}</p>
          </div>
        )}

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
