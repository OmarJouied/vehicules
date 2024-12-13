import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const currentUser = req.cookies.get('currentUser')?.value;

  if (!currentUser && !req.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}