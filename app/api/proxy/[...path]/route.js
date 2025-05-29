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
    // Await the params object before accessing its properties
    const resolvedParams = await params;
    const pathString = Array.isArray(resolvedParams.path)
      ? resolvedParams.path.join("/")
      : resolvedParams.path;

    const normalizedPath = ensureTrailingSlash(pathString);
    const token = request.headers.get("Authorization");

    let body;
    if (method === "POST") {
      body = await request.json();
    }

    const baseUrl = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
    const backendUrl = `${baseUrl}/api/${normalizedPath}`;

    const requestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: token }),
      },
    };

    if (method === "POST" && body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(backendUrl, requestOptions);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
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

export async function POST(request, { params }) {
  return handleRequest(request, params, "POST");
}
