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
    console.log('\x1b[33m', request.nextUrl.pathname, '\x1b[0m')

    const bearerCookie = request.cookies.get("x-token")?.value;
    const pathname = request.nextUrl.pathname;
    const isAuthPath = pathname.startsWith('/auth');

    // const isGuestPath = ["/app", "/app/setting"].some((path) => pathname === path);
    const isUserPath = ["/app/search", "/app/audit", "/app/files"].some((path) => pathname.indexOf(path) !== -1);
    const isAdminPath = ["/app/permission"].some((path) => pathname === path);

    if (bearerCookie?.startsWith("Bearer ")) token = bearerCookie.split(';')[0].split(" ")[1];
    console.log("middleware 2")
    console.log({ bearerCookie, isAdminPath, isAuthPath, isUserPath, token })

    if (!token) return isAuthPath ? NextResponse.next() : NextResponse.redirect(new URL('/auth/login', request.url));

    try {

        const { error, payload } = await verifyUserJWT(token);
        console.log("middleware 3")
        console.log({ error, payload })

        if (!payload) {
            const response = NextResponse.redirect(new URL(`/auth/login?${new URLSearchParams({ error: error! })}`, request.url));
            response.cookies.delete("x-token");
            return response
        }
        if (isAuthPath) return NextResponse.redirect(new URL('/app', request.url));

        const { username, account, role, exp } = payload;
        const userCheckResult = await fetch('http://localhost:3000/api/auth', {
            method: "PUT",
            body: JSON.stringify({ username, account, role }),
        })
        const { ok, username: trueUsername, role: trueRole } = (await userCheckResult.json()) as {
            ok: boolean;
            username: string;
            role: Role;
        };

        console.log("middleware 4")
        console.log({ ok, trueUsername, trueRole })

        if (!ok) {
            const response = NextResponse.redirect(new URL(`/auth/login?${new URLSearchParams({ error: "User does not exist." })}`, request.url));
            response.cookies.delete("x-token");
            return response
        }

        if (isUserPath && trueRole !== Role.USER && trueRole !== Role.ADMIN) return NextResponse.redirect(new URL('/app/setting', request.url));
        if (isAdminPath && trueRole !== Role.ADMIN) return NextResponse.redirect(new URL('/app/setting', request.url));

        const isRoleOrNameChange = trueUsername !== username || trueRole !== role
        const isAboutToExpired = exp && exp <= (Date.now() / 1000) + 60 * 60 * 1; // less than one hour to be exprired

        const requestHeader = new Headers(request.headers);
        requestHeader.set("x-username", encodeURIComponent(trueUsername));
        // requestHeader.set("x-account", account);
        requestHeader.set("x-role", trueRole);

        const response: AuthenticatedNextResponse = NextResponse.next({
            request: {
                headers: requestHeader,
            }
        });

        console.log("middleware 5")
        console.log({ isRoleOrNameChange, isAboutToExpired, trueUsername })

        if (isAboutToExpired || isRoleOrNameChange) {
            const token = await signUserJWT({ username: trueUsername, account, role: trueRole });
            const cookie = getCookie(token);
            response.cookies.set("x-token", cookie.substring(8));
        }

        return response;
    } catch (error) {
        console.error("middleware error", error);
        return NextResponse.redirect(new URL(`/?${new URLSearchParams({ error: String(error) })}`, request.url));
    }
}

export const config = {
    matcher: ['/app/:path*', '/auth/:path*'],
}