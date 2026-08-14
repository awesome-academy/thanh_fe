'use client';

import Link from 'next/link';
import { Heart, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WishlistEmptyState() {
  return (
    <div className="bg-surface-card border border-borderSubtle rounded-2xl p-12 text-center space-y-4 shadow-sm max-w-md mx-auto my-12">
      <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
        <Heart className="w-7 h-7 fill-rose-500/20" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-textStrong">Danh sách yêu thích trống</h2>
        <p className="text-xs text-textMuted leading-relaxed">
          Bạn chưa lưu tour du lịch nào. Hãy khám phá và lưu lại những chuyến đi mơ ước của bạn!
        </p>
      </div>
      <Link href="/tours" className="inline-block pt-2">
        <Button size="lg" className="bg-cacao-600 hover:bg-cacao-700 text-white font-bold rounded-xl flex items-center gap-2">
          <Compass className="w-4 h-4" />
          <span>Khám phá danh sách Tour</span>
        </Button>
      </Link>
    </div>
  );
}
