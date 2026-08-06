import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-[#0F2038] via-[#0B5A9C] to-[#137DD0] text-white px-4 sm:px-8 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto space-y-4">
          <p className="text-xs uppercase font-semibold tracking-widest text-sky-200">
            KHÁM PHÁ VIỆT NAM
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Tìm chuyến đi mơ ước của bạn
          </h1>
          <p className="text-sky-100 max-w-xl text-sm sm:text-base">
            Hơn 480 tour trong nước, giá minh bạch, xác nhận đặt chỗ trong 24 giờ.
          </p>
          <div className="pt-4">
            <Link href="/tours">
              <Button size="lg" className="bg-cacao-600 hover:bg-cacao-700 text-white font-medium shadow-md">
                Tìm tour
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
