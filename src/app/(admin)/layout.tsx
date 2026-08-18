import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface-page">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
