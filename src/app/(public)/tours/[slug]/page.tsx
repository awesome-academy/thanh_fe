import React from "react";

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-textStrong">Chi tiết Tour: {slug}</h1>
    </div>
  );
}
