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
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 0) {
          requestBody = await request.json();
          requestHeaders["Content-Type"] = "application/json";
          requestBody = JSON.stringify(requestBody);
        }
      } else if (contentType && contentType.includes("multipart/form-data")) {
        requestBody = await request.formData();
        // Content-Type is not set manually for FormData to allow fetch to set it automatically
      } else {
        const contentLength = request.headers.get("content-length");
        if (contentLength && parseInt(contentLength) > 0) {
          requestBody = await request.text();
        }
      }
    }

    const baseUrl = normalizeUrl(`${process.env.NEXT_PUBLIC_API_URL}/api`);
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
        ...requestHeaders,
      },
      ...(requestBody && (method === "POST" || method === "PATCH") && { body: requestBody }),
    };

    const response = await fetch(backendUrl, requestOptions);
    const responseContentType = response.headers.get("content-type");

    // Handle binary responses (e.g., Excel, PDF, images)
    if (
      responseContentType &&
      (
        responseContentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
        responseContentType.includes("application/octet-stream") ||
        responseContentType.includes("application/pdf") ||
        responseContentType.includes("image/")
      )
    ) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          "Content-Type": responseContentType,
          "Content-Disposition": response.headers.get("content-disposition") || "attachment; filename=\"users_export.xlsx\"",
          "Content-Length": buffer.byteLength.toString(),
        },
      });
    }

    // Handle JSON responses
    if (responseContentType && responseContentType.includes("application/json")) {
      const text = await response.text();
      if (!text) {
        return NextResponse.json({}, { status: response.status });
      }
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: response.status });
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Handle unexpected non-JSON, non-binary responses
    const text = await response.text();
    console.error(
      `[${method}] Unexpected response with Content-Type: ${responseContentType}, body: ${text}`
    );
    return NextResponse.json(
      { error: "Invalid response format", details: text },
      { status: response.status }
    );
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