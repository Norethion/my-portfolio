import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Auth is now handled per-route using DB check
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/api/admin/:path*",
};

