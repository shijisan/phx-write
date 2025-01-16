import { NextResponse } from "next/server";
import { checkAuth } from "@/utils/checkAuth";  // Import the checkAuth function

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/organization/")) {
    // Use checkAuth to validate the user
    const { isAuthenticated, user } = await checkAuth(req);

    // If not authenticated or user doesn't exist, redirect to login
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, redirecting to login...");
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.headers.set('X-Message', 'User is not authenticated, redirected to login.');
      return res;
    }

    // Log the authenticated user details
    console.log("Authenticated User:", user);
    const res = NextResponse.next();
    res.headers.set('X-Message', 'User authenticated successfully.');

    // Handle organization-specific logic
    if (pathname.startsWith("/organization/")) {
      const orgId = pathname.split("/")[2];

      if (!orgId) {
        console.log("No organization ID found, redirecting to dashboard...");
        const redirectRes = NextResponse.redirect(new URL("/dashboard", req.url));
        redirectRes.headers.set('X-Message', 'No organization ID found, redirected to dashboard.');
        return redirectRes;
      }

      // Pass the user ID in a custom header for API routes
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', user.id);  // Set user ID for further validation in API routes
      console.log("Passing user ID in custom header for organization-specific logic");

      // Clone the request with the new headers
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      response.headers.set('X-Message', 'User ID passed for organization-specific logic.');
      return response;
    }

    // If user is authenticated, proceed to next middleware or route
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/organization/:path*'],
};
