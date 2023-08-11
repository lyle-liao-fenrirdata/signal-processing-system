import { prisma } from "@/server/prisma";
import { signUserJWT, verifyUserJWT } from "@/utils/jwt";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get('token')
        if (!token) return NextResponse.json({ ok: false }, { status: 400 })

        const { payload, error } = await verifyUserJWT(token)
        if (payload) return NextResponse.json({ ok: false }, { status: 401 })

        return NextResponse.json({ ok: true, user: payload });
    } catch (error) {
        return NextResponse.json({ ok: false }, { status: 400, statusText: String(error) })
    }
}

export async function POST(request: Request) {
    try {
        const { token } = await request.json()
        if (!token) return NextResponse.json({ ok: false }, { status: 400, statusText: "Expect 'token' porperty in body JSON format." })

        const { payload, error } = await verifyUserJWT(token)
        if (error) return NextResponse.json({ ok: false }, { status: 401, statusText: "Invalid token." })

        const { username, role, account } = payload
        const newToken = await signUserJWT({ username, account, role })

        return NextResponse.json({ ok: true, token: newToken });
    } catch (error) {
        return NextResponse.json({ ok: false }, { status: 400, statusText: String(error) })
    }
}

export async function PUT(request: Request) {
    try {
        const { username, account, role } = await request.json()
        if (!username || !account || !role) return NextResponse.json({ ok: false }, { status: 400, statusText: "Expect 'username', 'account' and 'role' properties in body JSON format." })

        const trueUser = await prisma.user.findUnique({ where: { account }, select: { username: true, role: true, deletedAt: true } })
        if (!trueUser || Boolean(trueUser.deletedAt)) {
            return NextResponse.json({ ok: false })
        }
        return NextResponse.json({ ok: true, username: trueUser.username, role: trueUser.role })
    } catch (error) {
        return NextResponse.json({ ok: false }, { status: 400, statusText: String(error) })
    }
}




