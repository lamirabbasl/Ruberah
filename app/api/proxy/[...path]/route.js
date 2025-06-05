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
    const contentType = request.headers.get("Content-Type");

    let requestBody;
    let requestHeaders = {};

    if (method === "POST" || method === "PATCH") {
      if (contentType && contentType.includes("application/json")) {
        // Handle JSON body
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 0) {
          requestBody = await request.json();
          requestHeaders["Content-Type"] = "application/json";
          requestBody = JSON.stringify(requestBody); // Stringify for fetch
        }
      } else if (contentType && contentType.includes("multipart/form-data")) {
        // Handle FormData body (for file uploads)
        requestBody = await request.formData(); // Use request.formData() for FormData
        // When sending FormData, DO NOT set Content-Type header manually.
        // fetch will automatically set the correct 'Content-Type: multipart/form-data; boundary=...'
        // and handle the serialization of the FormData object.
      } else {
        // Handle other content types if needed, or assume no body
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 0) {
            requestBody = await request.text(); // Or handle as raw text if unsure
        }
      }
    }

    const baseUrl = normalizeUrl("http://188.121.100.138/api");
    const isStaticVideoPath =
      normalizedPath.startsWith("intro/video") &&
      /\.[a-zA-Z0-9]+$/.test(normalizedPath);

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
        ...requestHeaders, // Apply Content-Type here if set for JSON
      },
      // Only add body if it exists and is for POST/PATCH
      ...(requestBody && (method === "POST" || method === "PATCH") && { body: requestBody }),
    };

    const response = await fetch(backendUrl, requestOptions);

    const responseContentType = response.headers.get("content-type");

    if (responseContentType && responseContentType.includes("application/json")) {
      const text = await response.text();
      if (!text) {
        return NextResponse.json({}, { status: response.status });
      }
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    } else if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    } else if (response.status === 200) {
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

export async function PATCH(request, { params }) {
  return handleRequest(request, params, "PATCH");
}