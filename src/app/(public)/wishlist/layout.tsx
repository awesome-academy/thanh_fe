import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tour Yêu Thích | TripGo',
  description: 'Danh sách tour du lịch yêu thích của bạn trên TripGo.',
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
