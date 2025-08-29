// /api/logout/route.js - Create this new file for logout route

import { NextResponse } from "next/server";

function getDeleteCookieString(name) {
  const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
  return `${name}=; HttpOnly; Path=/; SameSite=Strict; ${secure} Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  res.headers.append("Set-Cookie", getDeleteCookieString("access_token"));
  res.headers.append("Set-Cookie", getDeleteCookieString("refresh_token"));
  return res;
}