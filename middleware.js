// middleware.js

import { NextResponse } from "next/server";

function normalizeUrl(url) {
  url = url.replace(/\/+$/, "");
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  return url;
}

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Fixed typo: _g -> _/
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getCookieString(name, value, maxAge) {
  const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
  return `${name}=${value}; HttpOnly; Path=/; SameSite=Strict; ${secure} Max-Age=${maxAge}; Expires=${expires}`;
}

function getDeleteCookieString(name) {
  const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
  return `${name}=; HttpOnly; Path=/; SameSite=Strict; ${secure} Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /profile routes only
  if (pathname.startsWith("/admin") || pathname.startsWith("/profile")) {
    let accessToken = request.cookies.get("access_token")?.value;
    const apiUrl = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
    const verificationUrl = `${apiUrl}/api/users/me`;

    let headers = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    try {
      let verificationResponse = await fetch(verificationUrl, { headers });

      if (verificationResponse.status === 401) {
        const refreshToken = request.cookies.get("refresh_token")?.value;
        if (refreshToken) {
          const refreshResponse = await fetch(`${apiUrl}/api/users/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            accessToken = refreshData.access;
            const newRefresh = refreshData.refresh || refreshToken;

            const accessPayload = parseJwt(accessToken);
            const accessMaxAge = accessPayload ? accessPayload.exp - Math.floor(Date.now() / 1000) : 300;

            const refreshPayload = parseJwt(newRefresh);
            const refreshMaxAge = refreshPayload ? refreshPayload.exp - Math.floor(Date.now() / 1000) : 86400;

            // Retry verification with new access
            headers.Authorization = `Bearer ${accessToken}`;
            verificationResponse = await fetch(verificationUrl, { headers });

            // Prepare response
            const response = verificationResponse.ok ? NextResponse.next() : NextResponse.redirect(new URL("/api/auth/login", request.url));

            // Set new cookies
            response.headers.append("Set-Cookie", getCookieString("access_token", accessToken, accessMaxAge));
            response.headers.append("Set-Cookie", getCookieString("refresh_token", newRefresh, refreshMaxAge));

            if (!verificationResponse.ok) {
              response.headers.append("Set-Cookie", getDeleteCookieString("access_token"));
              response.headers.append("Set-Cookie", getDeleteCookieString("refresh_token"));
              return response;
            }

            const userData = await verificationResponse.json();

            // For admin, check manager group
            if (pathname.startsWith("/admin")) {
              const isManager = Array.isArray(userData.groups) && userData.groups.includes("manager");
              if (!isManager) {
                return NextResponse.redirect(new URL("/", request.url));
              }
            }

            // Clone request headers and add Authorization for downstream
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set("Authorization", `Bearer ${accessToken}`);

            return NextResponse.next({
              request: {
                headers: requestHeaders,
              },
            });
          } else {
            // Refresh failed, clear cookies
            const redirectRes = NextResponse.redirect(new URL("/api/auth/login", request.url));
            redirectRes.headers.append("Set-Cookie", getDeleteCookieString("access_token"));
            redirectRes.headers.append("Set-Cookie", getDeleteCookieString("refresh_token"));
            return redirectRes;
          }
        } else {
          return NextResponse.redirect(new URL("/api/auth/login", request.url));
        }
      }

      if (!verificationResponse.ok) {
        return NextResponse.redirect(new URL("/api/auth/login", request.url));
      }

      const userData = await verificationResponse.json();

      if (pathname.startsWith("/admin")) {
        const isManager = Array.isArray(userData.groups) && userData.groups.includes("manager");
        if (!isManager) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }

      // Add Authorization to request headers
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("Error verifying user groups:", error.message);
      return NextResponse.redirect(new URL("/api/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};