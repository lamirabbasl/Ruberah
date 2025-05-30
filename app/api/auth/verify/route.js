import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    // Use the proxy route for verification
    const response = await fetch(`${request.nextUrl.origin}/api/proxy/users/me`, {
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Token verification failed: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      id: data.id,
      name: data.username,
      phone: data.phone_number,
      groups: data.groups,
      isAdmin: data.groups.includes("manager")
    });
  } catch (error) {
    console.error("Verify error:", error.message);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 401 }
    );
  }
}
