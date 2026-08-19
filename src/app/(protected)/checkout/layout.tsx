import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đặt Tour | TripGo',
  description:
    'Hoàn tất thông tin và thanh toán để xác nhận đặt tour du lịch của bạn trên TripGo.',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
