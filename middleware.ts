import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Role } from '@prisma/client';
import { verifyUserJWT } from './utils/jwt';

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
    return NextResponse.next();
    // const { username, role, exp } = verify.payload as { username: string, role: Role, iat: number, iss: string, exp: number };
    // const isAboutToExpired = exp - 60 * 60 * 1 <= Date.now() / 1000; // less than one hour to be exprired


    // if (isAboutToExpired) {
    //     const refresh = await refreshUserJWT(token!);
    //     if (!refresh.token) {
    //         const message = (refresh.error as {
    //             "code": string,
    //             "name": string,
    //             "message": string
    //         }).message
    //         return NextResponse.redirect(new URL(`/auth/login?${new URLSearchParams({ message })}`, request.url));
    //     }
    //     response.headers.set("Authorization", `Bearer ${refresh.token}`)
    // }

    // (request as AuthenticatedRequest).user = { username, role };

    // return response;
}

export const config = {
    matcher: ['/app/:path*', '/auth/:path*'],
}