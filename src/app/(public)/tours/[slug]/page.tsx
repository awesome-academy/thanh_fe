import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTourBySlug, getDestinationsMap } from '@/services/tour-service';
import TourGallery from '@/components/tours/TourGallery';
import TourOverview from '@/components/tours/TourOverview';
import TourItinerary from '@/components/tours/TourItinerary';
import TourBookingWidget from '@/components/tours/TourBookingWidget';
import TourReviewsSection from '@/components/tours/TourReviewsSection';
import { MapPin, Clock, Star, ShieldCheck } from 'lucide-react';

interface TourDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);

  if (!tour) {
    return { title: 'Không tìm thấy tour | TripGo' };
  }

  return {
    title: `${tour.name} | TripGo Du Lịch`,
    description: tour.description,
    alternates: { canonical: `/tours/${tour.slug}` },
    openGraph: {
      title: tour.name,
      description: tour.description,
      images: tour.image ? [tour.image] : [],
    },
  };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  const destMap = getDestinationsMap();

  if (!tour) {
    notFound();
  }

  const destName = destMap[tour.dest] || tour.dest;
  const nightsCount = Math.max(1, tour.days - 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-cacao-600 font-bold uppercase tracking-wider">
          <span className="px-2.5 py-1 rounded-full bg-cacao-50 border border-cacao-100">
            {tour.type || 'Du Lịch Hấp Dẫn'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-textMuted">
            <MapPin className="w-3.5 h-3.5 text-cacao-500" /> {destName}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-textStrong tracking-tight">
          {tour.name}
        </h1>

        <div className="flex items-center gap-4 text-xs text-textMuted">
          <div className="flex items-center gap-1 font-bold text-textStrong">
            <Star className="w-4 h-4 text-status-star fill-current" />
            <span>{tour.rating}</span>
            <span className="text-textSubtle font-normal">({tour.reviews} đánh giá)</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-cacao-500" />
            <span>{tour.days} ngày {nightsCount} đêm</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Xác nhận tức thì</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <TourGallery
        images={tour.images}
        gradient={tour.gradient}
        tourName={tour.name}
        categoryName={tour.type?.toUpperCase() || 'DU LỊCH'}
      />

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          <TourOverview
            description={tour.description}
            highlights={tour.highlights}
            included={tour.included}
            excluded={tour.excludes}
          />
          <TourItinerary daysCount={tour.days} itinerary={tour.itinerary} />
          <TourReviewsSection tourId={tour.id} slug={tour.slug} rating={tour.rating} />
        </div>

        {/* Right Column (1/3) Sticky Booking Widget */}
        <div className="lg:col-span-1 sticky top-24 h-fit">
          <TourBookingWidget
            tourId={tour.id}
            slug={tour.slug}
            price={tour.price}
            kidPrice={tour.kidPrice}
          />
        </div>
      </div>
    </div>
  );
}
