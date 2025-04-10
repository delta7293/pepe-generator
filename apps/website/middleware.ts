import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Limit middleware pathname config
export const config = {
  matcher: '/',
};

export async function middleware(req: NextRequest) {
  // Extract country
  const country = req.geo?.country || 'US';

  // Specify the correct pathname
  if (['CN', 'MO', 'TW', 'HK'].includes(country)) {
    req.nextUrl.pathname = '/blocked';
  }

  // Rewrite to URL
  return NextResponse.rewrite(req.nextUrl);
}
