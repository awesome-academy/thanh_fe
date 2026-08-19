import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đơn Hàng Của Tôi | TripGo',
  description:
    'Xem lịch sử và quản lý các đơn đặt tour du lịch của bạn trên TripGo.',
};

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
