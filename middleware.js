import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Use getUser() for secure server-side role validation
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const role = user?.user_metadata?.user_role;

  // Add this inside your middleware function right after const { data: { user } }
  console.log("Middleware Check:", {
    userFound: !!user,
    path: path,
    role: user?.user_metadata?.user_role,
  });
  // 1. Authentication Check: If no user, block protected routes
  const isProtectedRoute =
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path.startsWith("/for-sale");

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Admin Protection: Strict access to /admin
  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Agent Protection: Agents or Admins can access agent dashboard
  if (path.startsWith("/dashboard/agent")) {
    if (role !== "agent" && role !== "admin") {
      console.log("MiddleWare Blocked - Role:", role);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this to include your specific protected routes
     */
    "/dashboard/:path*",
    "/admin/:path*",
    "/add-new-listing",
  ],
};
