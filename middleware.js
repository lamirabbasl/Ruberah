import { NextResponse } from "next/server";

function normalizeUrl(url) {
  url = url.replace(/\/+$/, "");
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  return url;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check both cookie and Authorization header
  const token =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("Authorization");

  // Protect /admin and /profile routes only
  if (pathname.startsWith("/admin") || pathname.startsWith("/profile")) {
    if (!token) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/api/auth/login?callbackUrl=${callbackUrl}`, request.url)
      );
    }

    // If token exists but doesn't have Bearer prefix, add it
    const tokenWithBearer = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    // For admin routes, verify user is in manager group
    if (pathname.startsWith("/admin")) {
      try {
        // Use proxy route for verification
        const response = await fetch(new URL("/api/proxy/users/me", request.url), {
          headers: {
            Authorization: tokenWithBearer,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to verify user");
        }

        const userData = await response.json();

        // Check if user is in manager group
        const isManager = Array.isArray(userData.groups) && 
                        userData.groups.includes("manager");

        if (!isManager) {
          // Redirect non-manager users to home page
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        console.error("Error verifying user groups:", error.message);
        return NextResponse.redirect(new URL("/api/auth/login", request.url));
      }
    }

    // Clone the request headers and add the token
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", tokenWithBearer);

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
