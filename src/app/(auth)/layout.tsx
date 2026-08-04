import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page p-6">
      <div className="w-full max-w-md bg-surface-card p-8 rounded-xl border border-borderSubtle shadow-md">
        {children}
      </div>
    </div>
  );
}
