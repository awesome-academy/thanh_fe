import React from 'react';
import HeroSection from '@/components/homepage/HeroSection';
import CategoriesGrid from '@/components/homepage/CategoriesGrid';
import FeaturedTours from '@/components/homepage/FeaturedTours';
import WhyUsSection from '@/components/homepage/WhyUsSection';
import TestimonialsSection from '@/components/homepage/TestimonialsSection';

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

