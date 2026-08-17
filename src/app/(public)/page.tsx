import type { Metadata } from 'next';
import HeroSection from '@/components/homepage/HeroSection';
import CategoriesGrid from '@/components/homepage/CategoriesGrid';
import FeaturedTours from '@/components/homepage/FeaturedTours';
import WhyUsSection from '@/components/homepage/WhyUsSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';

export const metadata: Metadata = {
  title: 'TripGo – Đặt Tour Du Lịch Hàng Đầu Việt Nam',
  description:
    'Khám phá và đặt hàng nghìn tour du lịch trong nước và quốc tế. Giá tốt, hoàn hủy linh hoạt, hỗ trợ 24/7.',
  keywords: ['tour du lịch', 'đặt tour', 'du lịch việt nam', 'tripgo'],
  openGraph: {
    title: 'TripGo – Đặt Tour Du Lịch Hàng Đầu Việt Nam',
    description:
      'Khám phá và đặt hàng nghìn tour du lịch trong nước và quốc tế. Giá tốt, hoàn hủy linh hoạt.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="space-y-6 pb-12">
      <HeroSection />
      <CategoriesGrid />
      <FeaturedTours />
      <WhyUsSection />
      <TestimonialsSection />
    </div>
  );
}
