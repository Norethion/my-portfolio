import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect admin API routes (except GET requests)
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    // Allow GET requests without auth
    if (request.method === "GET") {
      return NextResponse.next();
    }

    const authHeader = request.headers.get("authorization");
    // Use NEXT_PUBLIC_ADMIN_KEY as the API token for simplicity
    const adminToken = process.env.NEXT_PUBLIC_ADMIN_KEY;

    if (!adminToken) {
      console.warn("Admin API token is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/api/admin/:path*",
};

