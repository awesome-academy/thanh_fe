'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories } from '@/hooks/use-categories';
import { Palmtree, Landmark, HeartHandshake, Mountain, Trees } from 'lucide-react';

const CATEGORY_ICONS = { Palmtree, Landmark, HeartHandshake, Mountain, Trees } as const;

function DynamicCategoryIcon({ iconName }: { iconName?: string }) {
  const IconComponent = CATEGORY_ICONS[iconName as keyof typeof CATEGORY_ICONS] ?? Palmtree;
  return <IconComponent className="w-6 h-6 text-cacao-500" />;
}

export default function CategoriesGrid() {
  const { data: categories, isLoading } = useCategories();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-bold text-cacao-600 uppercase tracking-widest">Danh Mục Nổi Bật</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-textStrong mt-1">Trải Nghiệm Theo Sở Thích</h2>
        </div>
        <Link href="/tours" className="text-sm font-medium text-cacao-600 hover:text-cacao-700 transition-colors">
          Xem tất cả danh mục &rarr;
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-surface-card rounded-2xl h-36 animate-pulse border border-borderSubtle" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories?.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tours?type=${cat.slug}`}
              className="group bg-surface-card border border-borderSubtle rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cacao-50 flex items-center justify-center transition-transform group-hover:scale-110">
                  <DynamicCategoryIcon iconName={cat.icon} />
                </div>
                <div>
                  <h3 className="font-bold text-textStrong text-base group-hover:text-cacao-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-textSubtle mt-0.5">{cat.tourCount} tour hấp dẫn</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
