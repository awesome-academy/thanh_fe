/**
 * Shimmer blur placeholder for next/image remote images.
 *
 * Remote images cannot auto-generate blur placeholders, so we provide a
 * lightweight SVG-based shimmer encoded as a base64 data URL.
 *
 * Usage:
 *   import { TOUR_IMAGE_BLUR } from '@/lib/image-placeholder';
 *   <Image ... placeholder="blur" blurDataURL={TOUR_IMAGE_BLUR} />
 */

const shimmerSvg = `
<svg width="700" height="475" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
      <stop stop-color="#1a2744" offset="0%" />
      <stop stop-color="#243358" offset="50%" />
      <stop stop-color="#1a2744" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="700" height="475" fill="#1a2744" />
  <rect width="700" height="475" fill="url(#g)" opacity="0.6" />
</svg>`.trim();

const toBase64 = (str: string): string => {
  if (typeof Buffer !== 'undefined') {
    // Node.js / Next.js server
    return Buffer.from(str).toString('base64');
  }
  // Browser
  return window.btoa(unescape(encodeURIComponent(str)));
};

/** Base64-encoded shimmer placeholder for landscape tour images (700×475). */
export const TOUR_IMAGE_BLUR = `data:image/svg+xml;base64,${toBase64(shimmerSvg)}`;

/** Smaller shimmer for thumbnail-size images (160×120). */
export const TOUR_THUMB_BLUR = TOUR_IMAGE_BLUR;
