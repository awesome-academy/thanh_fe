import React from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-page text-textBody">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
