import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from '@prisma/client';
import { getCookie, signUserJWT, verifyUserJWT } from './utils/jwt';

interface AuthenticatedNextResponse extends NextResponse {
    user?: { username: string, role: Role }
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    let token: string | undefined;

    const bearerCookie = request.cookies.get("x-token")?.value;
    const pathname = request.nextUrl.pathname;
    const isAuthPath = pathname.startsWith('/auth');

    // const isGuestPath = ["/app/dashboard", "/app/setting"].some((path) => pathname === path);
    const isUserPath = ["/app/search", "/app/audit"].some((path) => pathname === path);
    const isAdminPath = ["/app/permission"].some((path) => pathname === path);

    if (bearerCookie?.startsWith("Bearer ")) token = bearerCookie.substring(7);

    if (!token) return isAuthPath ? NextResponse.next() : NextResponse.redirect(new URL('/auth/login', request.url));
    if (pathname === '/app') return NextResponse.redirect(new URL('/app/dashboard', request.url))

    const { error, payload } = await verifyUserJWT(token);
    if (!payload) {
        const response = NextResponse.redirect(new URL(`/auth/login?${new URLSearchParams({ error: error! })}`, request.url));
        response.cookies.delete("x-token");
        return response
    }
    if (isAuthPath) return NextResponse.redirect(new URL('/app/dashboard', request.url));

    const { username, account, role, exp } = payload;

    if (isUserPath && role !== Role.USER && role !== Role.ADMIN) return NextResponse.redirect(new URL('/app/setting', request.url));
    if (isAdminPath && role !== Role.ADMIN) return NextResponse.redirect(new URL('/app/setting', request.url));

    const isAboutToExpired = exp && exp <= (Date.now() / 1000) + 60 * 60 * 1; // less than one hour to be exprired

    const requestHeader = new Headers(request.headers);
    requestHeader.set("x-username", encodeURIComponent(username));
    requestHeader.set("x-account", account);
    requestHeader.set("x-role", role);

    const response: AuthenticatedNextResponse = NextResponse.next({
        request: {
            headers: requestHeader,
        }
    });

    if (isAboutToExpired) {
        const token = await signUserJWT({ username, account, role });
        const cookie = getCookie(token);
        response.cookies.set("x-token", cookie);
    }

    return response;
}

export const config = {
    matcher: ['/app/:path*', '/auth/:path*'],
}