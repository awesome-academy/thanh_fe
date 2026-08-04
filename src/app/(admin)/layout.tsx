import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-surface-page">
      <aside className="w-64 bg-navy-900 text-white p-6 min-h-screen">
        <div className="font-bold text-lg mb-8">TripGo Admin</div>
        <nav className="space-y-2 text-sm text-slate-300">
          <div className="py-2 px-3 bg-navy-800 rounded font-medium text-white">Quản lý Tour</div>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
