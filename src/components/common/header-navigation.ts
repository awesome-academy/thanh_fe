export interface SearchParamsReader {
  get(name: string): string | null;
}

export interface HeaderNavContext {
  pathname: string;
  searchParams: SearchParamsReader;
}

export interface HeaderNavItem<TKey extends string = string> {
  key: TKey;
  label: string;
  href: string;
  priority: number;
  matches(context: HeaderNavContext): boolean;
}

function isToursPath(pathname: string): boolean {
  return pathname === '/tours' || pathname.startsWith('/tours/');
}

export const headerNavItems = [
  {
    key: 'tours',
    label: 'Tour',
    href: '/tours',
    priority: 0,
    matches: ({ pathname }) => isToursPath(pathname),
  },
  {
    key: 'destinations',
    label: 'Điểm đến',
    href: '/tours?dest=da-nang',
    priority: 10,
    matches: ({ pathname, searchParams }) =>
      isToursPath(pathname) && Boolean(searchParams.get('dest')),
  },
  {
    key: 'discounts',
    label: 'Ưu đãi',
    href: '/tours?sort=discount',
    priority: 20,
    matches: ({ pathname, searchParams }) =>
      isToursPath(pathname) && searchParams.get('sort') === 'discount',
  },
] as const satisfies readonly HeaderNavItem[];

export type HeaderNavKey = (typeof headerNavItems)[number]['key'];

export function resolveActiveHeaderNav<TKey extends string>(
  items: readonly HeaderNavItem<TKey>[],
  pathname: string,
  searchParams: SearchParamsReader,
): TKey | null {
  const context = { pathname, searchParams };
  let activeItem: HeaderNavItem<TKey> | null = null;

  for (const item of items) {
    if (
      item.matches(context) &&
      (activeItem === null || item.priority > activeItem.priority)
    ) {
      activeItem = item;
    }
  }

  return activeItem?.key ?? null;
}

export function getActiveHeaderNav(
  pathname: string,
  searchParams: SearchParamsReader,
): HeaderNavKey | null {
  return resolveActiveHeaderNav(headerNavItems, pathname, searchParams);
}
