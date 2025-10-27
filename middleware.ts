import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ROLE_ROUTES = {
  gerant: ['/', '/analytics', '/menu', '/reservations', '/staff', '/settings'],
  serveur: ['/tables', '/orders', '/payment'],
  bar: ['/bar'],
  cuisine: ['/kitchen'],
} as const;

export function middleware(request: NextRequest) {
  const role = (process.env.APP_ROLE as keyof typeof ROLE_ROUTES) || 'gerant';
  const pathname = request.nextUrl.pathname;

  // Allow API and assets
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  const allowedRoutes = ROLE_ROUTES[role] || ['/'];
  const isAllowed = allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isAllowed) {
    // Redirect to the first allowed route
    return NextResponse.redirect(new URL(allowedRoutes[0], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
