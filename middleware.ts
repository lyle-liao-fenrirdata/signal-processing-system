import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from '@prisma/client';
import { getCookie, signUserJWT, verifyUserJWT } from './utils/jwt';

interface AuthenticatedRequest extends NextRequest {
    user: { username: string, role: Role }
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    let token: string | undefined;

    const bearerCookie = request.cookies.get("x-token")?.value;
    const pathname = request.nextUrl.pathname;
    const isAuthPath = pathname.startsWith('/auth');
    if (bearerCookie?.startsWith("Bearer ")) token = bearerCookie.substring(7);

    if (!token) return isAuthPath ? NextResponse.next() : NextResponse.redirect(new URL('/auth/login', request.url));
    if (pathname === '/app') return NextResponse.redirect(new URL('/app/dashboard', request.url))

    const { error, verify } = await verifyUserJWT(token);
    if (!verify) {
        const message = (error as {
            "code": string,
            "name": string,
            "message": string
        }).message
        const response = NextResponse.redirect(new URL(`/auth/login?${new URLSearchParams({ message })}`, request.url));
        response.cookies.delete("x-token");
        return response
    }
    if (isAuthPath) return NextResponse.redirect(new URL('/app/dashboard', request.url));

    const { username, role, exp } = verify;
    const isAboutToExpired = exp && exp <= (Date.now() / 1000) + 60 * 60 * 1; // less than one hour to be exprired

    const response = NextResponse.next();

    if (isAboutToExpired) {
        const token = await signUserJWT({ username, role });
        const cookie = getCookie(token);
        response.cookies.set("x-token", cookie);
    }

    return response;
}

export const config = {
    matcher: ['/app/:path*', '/auth/:path*'],
}