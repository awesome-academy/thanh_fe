'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useBookings } from '@/hooks/use-bookings';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Copy, Check, ShoppingBag, Home, Calendar, Users, MapPin, Mail, Phone, CreditCard, ShieldCheck, AlertCircle, Compass } from 'lucide-react';

export default function BookingSuccessPage({
  params,
}: {
  params: Promise<{ bookingCode: string }>;
}) {
  const resolvedParams = use(params);
  const rawCode = resolvedParams?.bookingCode || 'TG-2026-000123';
  const bookingCode = decodeURIComponent(rawCode);

  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const { data: bookings, isLoading: loading } = useBookings();
  const booking =
    bookings?.find((b) => b.code === bookingCode || b.id === bookingCode) ?? null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(bookingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-cacao-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-textMuted">Đang xác thực thông tin đơn hàng #{bookingCode}...</p>
      </div>
    );
  }

  // If loading is done and no booking matches this code
  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-surface-card border border-borderSubtle rounded-2xl shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-textStrong">Không tìm thấy đơn hàng</h1>
        <p className="text-xs text-textMuted leading-relaxed">
          Mã đơn hàng <strong className="font-mono text-textStrong">&ldquo;{bookingCode}&rdquo;</strong> không tồn tại trên hệ thống hoặc không thuộc về tài khoản của bạn.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link href="/bookings" className="w-full">
            <Button size="lg" className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Đơn Hàng Của Tôi</span>
            </Button>
          </Link>
          <Link href="/tours" className="w-full">
            <Button variant="outline" size="lg" className="w-full border-borderSubtle text-textStrong hover:bg-surface-page font-bold rounded-xl flex items-center justify-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Khám Phá Tour</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      {/* Celebration Header Card */}
      <div className="bg-surface-card border border-borderSubtle rounded-3xl p-8 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-textStrong">Đơn Hàng Đã Khởi Tạo!</h1>
          <p className="text-xs sm:text-sm text-textMuted leading-relaxed max-w-md mx-auto">
            Cảm ơn bạn đã lựa chọn TripGo. Đơn đặt tour của bạn đã được ghi nhận trên hệ thống ở trạng thái chờ xác nhận.
          </p>
        </div>

        {/* Booking Code Highlight Card */}
        <div className="p-4 bg-cacao-50/50 border border-cacao-200 rounded-2xl max-w-md mx-auto space-y-2">
          <span className="text-[11px] font-bold text-cacao-700 uppercase tracking-wider">
            Mã đặt tour của bạn
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-extrabold text-navy-900 font-mono tracking-wider">
              {booking.code}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-2 bg-white border border-borderSubtle hover:border-cacao-500 rounded-xl text-textStrong hover:text-cacao-600 transition-all shadow-xs cursor-pointer"
              title="Sao chép mã đặt tour"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] font-semibold text-emerald-600">
              Đã sao chép mã đặt tour!
            </p>
          )}
          {copyFailed && (
            <p className="text-[11px] font-semibold text-rose-600">
              Không sao chép được, vui lòng chọn và copy mã thủ công.
            </p>
          )}
        </div>
      </div>

      {/* Booking Overview Card */}
      <div className="bg-surface-card border border-borderSubtle rounded-2xl p-6 shadow-sm space-y-4 text-xs">
        <h2 className="font-bold text-textStrong text-sm border-b border-borderSubtle pb-2">
          Chi tiết đơn hàng #{booking.code}
        </h2>

        <div className="space-y-2 text-textBody">
          <p className="font-bold text-sm text-navy-900">{booking.tourName}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-textMuted pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cacao-500" />
              <span>{booking.tourDest}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cacao-500" />
              <span>Khởi hành: {booking.departDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cacao-500" />
              <span>
                {booking.adults} Người lớn{booking.children > 0 ? `, ${booking.children} Trẻ em` : ''}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-cacao-500" />
              <span>Thanh toán: <strong className="text-cacao-600">{booking.totalPrice.toLocaleString('vi-VN')} đ</strong></span>
            </span>
          </div>

          <div className="pt-2 border-t border-borderSubtle grid grid-cols-1 sm:grid-cols-2 gap-1 text-textSubtle">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cacao-500" />
              <span>{booking.contact.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cacao-500" />
              <span>{booking.contact.phone}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Guarantee Note */}
      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2 text-xs text-emerald-800 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Đơn hàng đã được lưu thành công. Bạn có thể theo dõi trạng thái tại trang Quản lý đơn hàng.</span>
      </div>

      {/* Navigation Shortcuts */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/bookings" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Xem Đơn Hàng Của Tôi</span>
          </Button>
        </Link>

        <Link href="/" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full border-borderSubtle text-textStrong hover:bg-surface-page font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
