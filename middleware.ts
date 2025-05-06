import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// List of paths that don't require authentication
const publicPaths = ["/", "/auth/login", "/auth/signup","/auth/forgotpassword","/auth/reset-password", "/recipes", "/shops"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (publicPath) =>
      path === publicPath ||
      path.startsWith("/api/auth/") ||
      path.startsWith("/recipes/") ||
      path.startsWith("/shops/") ||
      path.startsWith("/api/recipes/") ||
      path.startsWith("/api/users/") || 
      path.startsWith("/api/shops/")
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    // Verify token
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "your-default-secret")
    );
    return NextResponse.next();
  } catch (error) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Configure the paths that should be processed by this middleware
export const config = {
  matcher: [
    // Match all paths except these
    "/((?!_next|api/auth|auth/login|auth/signup|auth/forgotpassword|auth/reset-password|favicon.ico|api/recipes|api/shops).*)",
  ],
};
