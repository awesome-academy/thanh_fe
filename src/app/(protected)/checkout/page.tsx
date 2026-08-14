'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Tour } from '@/types';
import { getTourBySlug } from '@/services/tour-service';
import { useCreateBooking } from '@/hooks/use-bookings';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import GuestInfoStep, { GuestInfoValues } from '@/components/checkout/GuestInfoStep';
import PaymentStep, { PaymentMethodType } from '@/components/checkout/PaymentStep';
import OrderSummaryStep from '@/components/checkout/OrderSummaryStep';
import { Button } from '@/components/ui/button';
import { Compass, AlertCircle } from 'lucide-react';

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const slug = searchParams.get('slug') || searchParams.get('tourId');

  const todayStr = new Date().toISOString().split('T')[0];
  const rawDate = searchParams.get('date');
  const isValidDateStr = Boolean(rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate));
  const date = isValidDateStr && rawDate && rawDate >= todayStr ? rawDate : todayStr;

  const rawAdults = Number(searchParams.get('adults'));
  const adults = Number.isInteger(rawAdults) && rawAdults >= 1 ? rawAdults : 1;

  const rawChildren = Number(searchParams.get('children'));
  const childrenCount = Number.isInteger(rawChildren) && rawChildren >= 0 ? rawChildren : 0;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const [guestInfo, setGuestInfo] = useState<GuestInfoValues>({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('momo');
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate: createBooking, isPending: isSubmitting } = useCreateBooking();

  // Sync user info if session finishes loading after page mount
  useEffect(() => {
    if (session?.user) {
      setGuestInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || session.user?.name || '',
        email: prev.email || session.user?.email || '',
      }));
    }
  }, [session]);

  useEffect(() => {
    let isMounted = true;
    if (!slug) {
      setLoading(false);
      return;
    }

    getTourBySlug(slug).then((res) => {
      if (isMounted) {
        setTour(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-cacao-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-textMuted">Đang tải thông tin tour...</p>
      </div>
    );
  }

  // Guard: No tour selected
  if (!slug || !tour) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-card border border-borderSubtle rounded-2xl shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-textStrong">Chưa chọn tour cần đặt</h1>
        <p className="text-xs text-textMuted leading-relaxed">
          Vui lòng chọn tour du lịch yêu thích từ danh sách để bắt đầu quy trình đặt tour và thanh toán.
        </p>
        <Link href="/tours" className="inline-block pt-2">
          <Button size="lg" className="bg-cacao-600 hover:bg-cacao-700 text-white font-bold rounded-xl flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Khám phá danh sách Tour</span>
          </Button>
        </Link>
      </div>
    );
  }

  const handleGuestSubmit = (values: GuestInfoValues) => {
    setGuestInfo(values);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (method: PaymentMethodType) => {
    setPaymentMethod(method);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalBookingSubmit = () => {
    setServerError(null);
    createBooking(
      {
        tourId: tour.id,
        date,
        adults,
        children: childrenCount,
        paymentMethod,
        contact: {
          fullName: guestInfo.fullName,
          email: guestInfo.email,
          phone: guestInfo.phone,
          note: guestInfo.note || '',
        },
      },
      {
        onSuccess: (data) => {
          const bookingCode = data.code || `TG-2026-${data.id}`;
          router.push(`/checkout/success/${encodeURIComponent(bookingCode)}`);
        },
        onError: (err) => {
          setServerError(err.message || 'Không thể khởi tạo đơn hàng');
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-textStrong">Thanh Toán Đặt Tour</h1>
        <p className="text-xs sm:text-sm text-textMuted">
          Hoàn tất 3 bước đơn giản để giữ chỗ cho chuyến du lịch tuyệt vời của bạn
        </p>
      </div>

      {/* Stepper */}
      <CheckoutStepper currentStep={currentStep} />

      {/* Step Contents */}
      {currentStep === 1 && (
        <GuestInfoStep initialValues={guestInfo} onSubmit={handleGuestSubmit} />
      )}

      {currentStep === 2 && (
        <PaymentStep
          initialMethod={paymentMethod}
          onBack={() => setCurrentStep(1)}
          onSubmit={handlePaymentSubmit}
        />
      )}

      {currentStep === 3 && (
        <OrderSummaryStep
          tour={tour}
          date={date}
          adults={adults}
          childrenCount={childrenCount}
          guestInfo={guestInfo}
          paymentMethod={paymentMethod}
          isSubmitting={isSubmitting}
          serverError={serverError}
          onBack={() => setCurrentStep(2)}
          onSubmit={handleFinalBookingSubmit}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-textMuted">Đang tải...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
