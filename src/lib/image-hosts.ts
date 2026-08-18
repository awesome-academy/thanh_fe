export const ALLOWED_IMAGE_HOSTS = ['images.unsplash.com'] as const;

/** True when `value` is an https URL on a host next/image is configured for. */
export function isAllowedImageUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  return (
    url.protocol === 'https:' &&
    (ALLOWED_IMAGE_HOSTS as readonly string[]).includes(url.hostname)
  );
}
