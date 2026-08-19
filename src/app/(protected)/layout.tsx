import React from "react";
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-page">
      <main className="max-w-6xl mx-auto p-8">{children}</main>
    </div>
  );
}
