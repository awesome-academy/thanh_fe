/**
 * Vietnamese-safe slug generation.
 *
 * NFD decomposition strips tone marks, but `đ` (U+0111) has no combining
 * form and survives decomposition — it has to be mapped explicitly, after
 * lowercasing so `Đ` is covered by the same rule.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * A slug that does not collide with `existing`, suffixed -2, -3, ... on clash.
 */
export function uniqueSlug(input: string, existing: string[]): string {
  const base = slugify(input);
  if (!existing.includes(base)) {
    return base;
  }

  let suffix = 2;
  while (existing.includes(`${base}-${suffix}`)) {
    suffix += 1;
  }
  return `${base}-${suffix}`;
}
