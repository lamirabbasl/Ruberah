import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check cookie or Authorization header
  const tokenRaw =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("Authorization");

  // Only protect /admin and /profile
  if (pathname.startsWith("/admin") || pathname.startsWith("/profile")) {
    if (!tokenRaw) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/api/auth/login?callbackUrl=${callbackUrl}`, request.url)
      );
    }

    // Remove duplicate Bearer prefix if present
    const tokenStripped = tokenRaw.replace(/^Bearer\s+/, "").trim();
    const authorizationHeader = `Bearer ${tokenStripped}`;

    // Restrict /admin to users in manager group
    if (pathname.startsWith("/admin")) {
      try {
        const userInfoUrl = `${request.nextUrl.origin}/api/proxy/users/me`;

        console.log("Calling user verification API:", userInfoUrl);

        const response = await fetch(userInfoUrl, {
          headers: {
            Authorization: authorizationHeader,
          },
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const userData = await response.json();

        const isManager =
          Array.isArray(userData.groups) && userData.groups.includes("manager");

        if (!isManager) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch (error) {
        console.error("Error verifying user groups:", error.message);
        return NextResponse.redirect(new URL("/api/auth/login", request.url));
      }
    }

    // Pass request with Authorization header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Authorization", authorizationHeader);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Allow public routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
