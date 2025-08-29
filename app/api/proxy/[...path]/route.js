// route.js (or whatever your catch-all route file is named, e.g., /api/proxy/[...path]/route.js)

import { NextResponse } from "next/server";

function ensureTrailingSlash(path) {
  return path.endsWith("/") ? path : `${path}/`;
}

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
    //     const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
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

async function handleRequest(request, params, method) {
  try {
    const resolvedParams = await params;
    const pathString = Array.isArray(resolvedParams.path)
      ? resolvedParams.path.join("/")
      : resolvedParams.path;

    const normalizedPath = ensureTrailingSlash(pathString);

    const accessToken = request.cookies.get("access_token")?.value;
    const contentType = request.headers.get("Content-Type");

    let requestBody;
    let requestHeaders = {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    if (method === "POST" || method === "PATCH") {
      if (contentType && contentType.includes("application/json")) {
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 0) {
          requestBody = await request.json();
          requestHeaders["Content-Type"] = "application/json";
          requestBody = JSON.stringify(requestBody);
        }
      } else if (contentType && contentType.includes("multipart/form-data")) {
        requestBody = await request.formData();
      } else {
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 0) {
          requestBody = await request.text();
        }
      }
    }

    const baseUrl = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
    const isStaticVideoPath =
      normalizedPath.startsWith("intro/video") &&
      /\.[a-zA-Z0-9]+$/.test(normalizedPath);

    const url = new URL(request.url);
    const queryString = url.search;

    let backendUrl = isStaticVideoPath
      ? `${baseUrl}/${normalizedPath}${queryString}`
      : `${baseUrl}/api/${normalizedPath}${queryString}`;

    let response = await fetch(backendUrl, {
      method,
      headers: requestHeaders,
      ...(requestBody && { body: requestBody }),
    });

    // Handle 401 with refresh
    if (
      response.status === 401 &&
      !normalizedPath.includes("token/refresh") &&
      !normalizedPath.includes("login") // Adjust if login path is different
    ) {
      const refreshToken = request.cookies.get("refresh_token")?.value;
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${baseUrl}/api/users/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh: refreshToken }),
          });

          if (!refreshResponse.ok) throw new Error("Refresh failed");

          const refreshData = await refreshResponse.json();
          const newAccess = refreshData.access;
          const newRefresh = refreshData.refresh || refreshToken; // If not rotating

          // Parse exp for maxAge
          const accessPayload = parseJwt(newAccess);
          const accessMaxAge = accessPayload ? accessPayload.exp - Math.floor(Date.now() / 1000) : 300; // Default 5min

          const refreshPayload = parseJwt(newRefresh);
          const refreshMaxAge = refreshPayload ? refreshPayload.exp - Math.floor(Date.now() / 1000) : 86400; // Default 1day

          // Retry original request with new access
          requestHeaders.Authorization = `Bearer ${newAccess}`;
          response = await fetch(backendUrl, {
            method,
            headers: requestHeaders,
            ...(requestBody && { body: requestBody }),
          });

          // Prepare NextResponse from retry response
          const finalRes = await createNextResponse(response);

          // Set new cookies on response
          finalRes.headers.append("Set-Cookie", getCookieString("access_token", newAccess, accessMaxAge));
          finalRes.headers.append("Set-Cookie", getCookieString("refresh_token", newRefresh, refreshMaxAge));

          return finalRes;
        } catch (error) {
          console.error("Refresh failed:", error);
          // Optionally clear cookies on failure
          const errorRes = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          errorRes.headers.append("Set-Cookie", getDeleteCookieString("access_token"));
          errorRes.headers.append("Set-Cookie", getDeleteCookieString("refresh_token"));
          return errorRes;
        }
      }
    }

    // Handle login specially to set cookies
    if (normalizedPath === "users/token/" && method === "POST" && response.ok) { // Adjust login path if needed
      const data = await response.json();
      const access = data.access;
      const refresh = data.refresh;

      if (access && refresh) {
        const accessPayload = parseJwt(access);
        const accessMaxAge = accessPayload ? accessPayload.exp - Math.floor(Date.now() / 1000) : 300;

        const refreshPayload = parseJwt(refresh);
        const refreshMaxAge = refreshPayload ? refreshPayload.exp - Math.floor(Date.now() / 1000) : 86400;

        // Fetch user data to return
        const userResponse = await fetch(`${baseUrl}/api/users/me/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const loginRes = NextResponse.json(userData, { status: 200 });
          loginRes.headers.append("Set-Cookie", getCookieString("access_token", access, accessMaxAge));
          loginRes.headers.append("Set-Cookie", getCookieString("refresh_token", refresh, refreshMaxAge));
          return loginRes;
        }
      }
    }

    return await createNextResponse(response);
  } catch (error) {
    console.error(`[${method}] Proxy error:`, error.message);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

async function createNextResponse(fetchResponse) {
  const contentType = fetchResponse.headers.get("content-type");

  if (
    contentType &&
    (contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
      contentType.includes("application/octet-stream") ||
      contentType.includes("application/pdf") ||
      contentType.includes("image/"))
  ) {
    const buffer = await fetchResponse.arrayBuffer();
    return new NextResponse(buffer, {
      status: fetchResponse.status,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": fetchResponse.headers.get("content-disposition") || "attachment; filename=\"file\"",
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  }

  if (contentType && contentType.includes("application/json")) {
    const text = await fetchResponse.text();
    if (!text) {
      return NextResponse.json({}, { status: fetchResponse.status });
    }
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: fetchResponse.status });
  }

  if (fetchResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const text = await fetchResponse.text();
  console.error(`Unexpected response with Content-Type: ${contentType}, body: ${text}`);
  return NextResponse.json({ error: "Invalid response format", details: text }, { status: fetchResponse.status });
}

export async function GET(request, { params }) {
  return handleRequest(request, params, "GET");
}

export async function DELETE(request, { params }) {
  return handleRequest(request, params, "DELETE");
}

export async function POST(request, { params }) {
  return handleRequest(request, params, "POST");
}

export async function PATCH(request, { params }) {
  return handleRequest(request, params, "PATCH");
}