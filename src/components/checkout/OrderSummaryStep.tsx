'use client';

import Image from 'next/image';
import { Tour } from '@/types';
import { GuestInfoValues } from './GuestInfoStep';
import { PaymentMethodType } from './PaymentStep';
import { TOUR_IMAGE_BLUR, TOUR_GRADIENT_FALLBACK } from '@/lib/image-placeholder';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, User, Mail, Phone, ArrowLeft, CheckCircle2, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

interface OrderSummaryStepProps {
  tour: Tour;
  date: string;
  adults: number;
  childrenCount: number;
  guestInfo: GuestInfoValues;
  paymentMethod: PaymentMethodType;
  isSubmitting: boolean;
  serverError: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

const paymentNames: Record<PaymentMethodType, string> = {
  momo: 'Ví điện tử MoMo (Quét mã QR)',
  vnpay: 'Cổng thanh toán VNPay',
  transfer: 'Chuyển khoản Ngân hàng (24/7)',
  card: 'Thẻ quốc tế (Visa / MasterCard)',
};

export default function OrderSummaryStep({
  tour,
  date,
  adults,
  childrenCount,
  guestInfo,
  paymentMethod,
  isSubmitting,
  serverError,
  onBack,
  onSubmit,
}: OrderSummaryStepProps) {
  const adultTotal = adults * tour.price;
  const childTotal = childrenCount * tour.kidPrice;
  const grandTotal = adultTotal + childTotal;

  return (
    <div className="space-y-6">
      {/* Server Error Alert */}
      {serverError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Main Order Recap Container */}
      <div className="bg-surface-card border border-borderSubtle rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-borderSubtle pb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-textStrong flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cacao-600" />
            <span>Xác nhận thông tin & Chi tiết thanh toán</span>
          </h2>
          <span className="text-xs font-bold text-navy-900 bg-cacao-100 px-3 py-1 rounded-full">
            Bước 3 / 3
          </span>
        </div>

        {/* Tour Information Recap */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface-page border border-borderSubtle rounded-2xl">
          <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
            {tour.image ? (
              <Image
                src={tour.image}
                alt={tour.name}
                fill
                className="object-cover"
                sizes="(max-width: 639px) calc(100vw - 64px), 128px"
                placeholder="blur"
                blurDataURL={TOUR_IMAGE_BLUR}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: tour.gradient || TOUR_GRADIENT_FALLBACK }}
              />
            )}
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-textStrong text-base leading-snug">{tour.name}</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-textMuted font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cacao-500" />
                <span>{tour.dest}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cacao-500" />
                <span>{date}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-cacao-500" />
                <span>{adults} Người lớn{childrenCount > 0 ? `, ${childrenCount} Trẻ em` : ''}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Grid: Contact Info & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Guest Contact Details */}
          <div className="p-4 bg-surface-page border border-borderSubtle rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-textMuted border-b border-borderSubtle pb-2">
              Thông tin liên hệ
            </h4>
            <div className="text-xs space-y-1.5 text-textBody font-medium pt-1">
              <p className="flex items-center gap-2 text-textStrong font-bold">
                <User className="w-3.5 h-3.5 text-cacao-500" />
                <span>{guestInfo.fullName}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cacao-500" />
                <span>{guestInfo.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cacao-500" />
                <span>{guestInfo.phone}</span>
              </p>
              {guestInfo.note && (
                <p className="flex items-start gap-2 text-textSubtle pt-1 border-t border-borderSubtle mt-2">
                  <FileText className="w-3.5 h-3.5 text-cacao-500 shrink-0 mt-0.5" />
                  <span className="italic">&ldquo;{guestInfo.note}&rdquo;</span>
                </p>
              )}
            </div>
          </div>

          {/* Selected Payment Method */}
          <div className="p-4 bg-surface-page border border-borderSubtle rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-textMuted border-b border-borderSubtle pb-2">
              Phương thức thanh toán
            </h4>
            <div className="text-xs space-y-1.5 text-textBody font-medium pt-1">
              <p className="font-bold text-navy-900 text-sm">
                {paymentNames[paymentMethod]}
              </p>
              <p className="text-textSubtle leading-relaxed">
                Mã xác nhận đơn đặt tour và thông tin thanh toán chi tiết sẽ được gửi qua email ngay sau khi tạo thành công.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Price Breakdown Table */}
        <div className="border border-borderSubtle rounded-2xl p-4 bg-cacao-50/30 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cacao-800 border-b border-cacao-100 pb-2">
            Bảng kê chi tiết giá
          </h4>
          <div className="space-y-2 text-xs text-textBody">
            <div className="flex justify-between items-center">
              <span>Người lớn ({adults} × {tour.price.toLocaleString('vi-VN')} đ):</span>
              <span className="font-semibold">{adultTotal.toLocaleString('vi-VN')} đ</span>
            </div>
            {childrenCount > 0 && (
              <div className="flex justify-between items-center">
                <span>Trẻ em ({childrenCount} × {tour.kidPrice.toLocaleString('vi-VN')} đ):</span>
                <span className="font-semibold">{childTotal.toLocaleString('vi-VN')} đ</span>
              </div>
            )}
            <div className="flex justify-between items-center text-textMuted">
              <span>Phí dịch vụ & Bảo hiểm du lịch:</span>
              <span className="font-semibold text-emerald-600">Miễn phí (0 đ)</span>
            </div>
            <div className="pt-3 border-t border-cacao-200 flex justify-between items-center text-base font-bold text-textStrong">
              <span>Tổng chi phí cần thanh toán:</span>
              <span className="text-xl text-cacao-600 font-bold">
                {grandTotal.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-textSubtle bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Cam kết bảo mật thông tin & Giữ chỗ 100% khi nhận được xác nhận đơn</span>
        </div>
      </div>

      {/* Navigation & Submit CTA */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onBack}
          size="lg"
          className="border-borderSubtle text-textStrong hover:bg-surface-page font-bold py-3 px-6 rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </Button>

        <Button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          size="lg"
          className="bg-cacao-600 hover:bg-cacao-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <span>{isSubmitting ? 'Đang tạo đơn hàng...' : 'Xác Nhận & Đặt Tour'}</span>
        </Button>
      </div>
    </div>
  );
}
