import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }
    const response = await fetch(`${process.env.API_BASE_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }
    const { role } = await response.json();
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};