import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const isAuth = await getToken({ req });
  const path = req.nextUrl;

  if (!isAuth && !path.pathname.startsWith('/login')) {
    return Response.redirect(new URL(`/login?next=${encodeURIComponent(path.pathname + path.search)}`, req.url));
  }

  if (isAuth && path.pathname.startsWith('/login')) {
    const url = new URL(path.href);
    const next = url.searchParams.get('next');
    return Response.redirect(new URL(decodeURIComponent(next || '/'), req.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}