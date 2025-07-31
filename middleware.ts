import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // Apply basic auth protection (no admin check here)
  return withAuth(req);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/vendor/:path*"
  ]
};
