import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/tours', '/tours/'],
        disallow: ['/api/', '/admin/', '/checkout', '/bookings', '/wishlist'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
