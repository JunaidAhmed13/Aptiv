import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect the dashboard (and its API needs). Everything else (landing, auth) is public.
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/api/screen(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|map)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
