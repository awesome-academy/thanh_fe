import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh Sách Tour Du Lịch | TripGo',
  description:
    'Tìm kiếm và khám phá hàng trăm tour du lịch hấp dẫn trong nước và quốc tế với giá tốt nhất.',
  keywords: ['tour du lịch', 'tìm tour', 'danh sách tour', 'tripgo'],
  openGraph: {
    title: 'Danh Sách Tour Du Lịch | TripGo',
    description: 'Hàng trăm tour du lịch hấp dẫn với giá tốt nhất.',
    type: 'website',
  },
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
