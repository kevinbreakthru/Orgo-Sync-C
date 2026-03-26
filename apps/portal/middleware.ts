import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Non-NEXT_PUBLIC so they're read at runtime on Vercel's Edge, not inlined at build time.
const MARKETING_DOMAIN = process.env.MARKETING_DOMAIN;
const PORTAL_DOMAIN = process.env.PORTAL_DOMAIN;

const MARKETING_PATHS = ["/", "/platform", "/builder", "/operator", "/getstarted"];
const PORTAL_PREFIXES = ["/dashboard", "/login", "/signup", "/callback", "/docs"];

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/signup"];

function isPortalPath(pathname: string) {
  return PORTAL_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.replace(/:\d+$/, "");
  const pathname = request.nextUrl.pathname;

  // ── Hostname-based routing (only when domains are configured) ──────────
  if (MARKETING_DOMAIN && PORTAL_DOMAIN && hostname) {
    const isOnMarketing =
      hostname === MARKETING_DOMAIN || hostname === `www.${MARKETING_DOMAIN}`;
    const isOnPortal = hostname === PORTAL_DOMAIN;

    if (isOnMarketing && isPortalPath(pathname)) {
      const url = new URL(pathname + request.nextUrl.search, `https://${PORTAL_DOMAIN}`);
      return NextResponse.redirect(url);
    }

    if (isOnPortal) {
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (MARKETING_PATHS.includes(pathname)) {
        const url = new URL(pathname + request.nextUrl.search, `https://${MARKETING_DOMAIN}`);
        return NextResponse.redirect(url);
      }
    }
  }

  // ── Auth guard (portal routes only) ────────────────────────────────────
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }>
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as never)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|css)$).*)",
  ],
};
