import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

/*
 * Vérification rapide avant le rendu : toute route /admin/* sans session valide
 * est redirigée vers /admin/login. L'autorisation réelle est refaite dans chaque
 * page et chaque Server Action admin (requireAdmin).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/admin/login") {
    return loggedIn ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  if (!loggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/upload"],
};
