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

async function handleRequest(request, params, method) {
  try {
    const resolvedParams = await params;
    const pathString = Array.isArray(resolvedParams.path)
      ? resolvedParams.path.join("/")
      : resolvedParams.path;

    const normalizedPath = ensureTrailingSlash(pathString);
    const token = request.headers.get("Authorization");

    let body;
    if (method === "POST") {
      // Check if request has body before parsing
      const contentLength = request.headers.get("content-length");
      if (contentLength && parseInt(contentLength) > 0) {
        body = await request.json();
      }
    }

    const baseUrl = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
    // If the path is for static video files (has file extension), do not add /api/ prefix
    const isStaticVideoPath =
      normalizedPath.startsWith("intro/video") &&
      /\.[a-zA-Z0-9]+$/.test(normalizedPath);

    // Avoid double /api/ if baseUrl already ends with /api
    const baseUrlEndsWithApi = baseUrl.endsWith("/api");

    const backendUrl = isStaticVideoPath
      ? `${baseUrl}/${normalizedPath}`
      : baseUrlEndsWithApi
      ? `${baseUrl}/${normalizedPath}`
      : `${baseUrl}/api/${normalizedPath}`;

    const requestOptions = {
      method,
      headers: {
        ...(token && { Authorization: token }),
      },
    };

    // Only add Content-Type for JSON requests
    if (method === "POST" && body) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(backendUrl, requestOptions);

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      // Try to read text first to check if body is empty
      const text = await response.text();
      if (!text) {
        // Empty body, return empty JSON
        return NextResponse.json({}, { status: response.status });
      }
      // Parse JSON from text
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } else if (response.status === 204) {
      // No content response, return empty with 204 status
      return new NextResponse(null, { status: 204 });
    } else if (response.status === 200) {
      // Handle empty body with 200 status as success
      const text = await response.text();
      if (!text) {
        return NextResponse.json({}, { status: 200 });
      } else {
        console.error(
          `[${method}] Non-JSON response received with body: ${text}`
        );
        return NextResponse.json(
          { error: "Invalid response format", details: text },
          { status: response.status }
        );
      }
    } else {
      const text = await response.text();
      console.error(`[${method}] Non-JSON response received`);
      return NextResponse.json(
        { error: "Invalid response format", details: text },
        { status: response.status }
      );
    }
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

export async function GET(request, { params }) {
  return handleRequest(request, params, "GET");
}

export async function DELETE(request, { params }) {
  return handleRequest(request, params, "DELETE");
}

export async function POST(request, { params }) {
  return handleRequest(request, params, "POST");
}
