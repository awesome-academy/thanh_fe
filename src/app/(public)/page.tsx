import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-navy-900 via-cacao-700 to-cacao-500 text-white px-8 py-20">
        <div className="max-w-5xl mx-auto space-y-4">
          <p className="text-xs uppercase font-semibold tracking-widest text-sky-200">
            Khám phá Việt Nam
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Tìm chuyến đi mơ ước của bạn
          </h1>
          <p className="text-sky-100 max-w-xl text-base">
            Hơn 480 tour trong nước, giá minh bạch, xác nhận đặt chỗ trong 24 giờ.
          </p>
          <div className="pt-4">
            <Link href="/tours">
              <Button size="lg" className="bg-cacao-600 hover:bg-cacao-600/90 text-white">
                Khám phá ngay
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
