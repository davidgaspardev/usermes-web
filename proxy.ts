import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location");

  if (!location) {
    return NextResponse.redirect(new URL("/location", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
