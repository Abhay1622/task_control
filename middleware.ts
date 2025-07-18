// middleware.ts (create this file in your root directory, same level as package.json)
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Optional: Add any additional middleware logic here
    console.log("Protected route accessed:", req.nextUrl.pathname);
    console.log("User token exists:", !!req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Return true if user is authenticated
        // The token will be null if user is not logged in
        return !!token;
      },
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - api/register (your registration API)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - register (register page)
     * - / (home page - currently public, change if needed)
     * 
     * This regex protects ALL other routes
     */
    "/((?!api/auth|api/register|_next/static|_next/image|favicon.ico|login|register|$).*)",
  ],
};