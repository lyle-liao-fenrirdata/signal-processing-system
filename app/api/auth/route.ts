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

        const { username, role } = payload
        const newToken = await signUserJWT({ username, role })

        return NextResponse.json({ ok: true, token: newToken });
    } catch (error) {
        return NextResponse.json({ ok: false }, { status: 400, statusText: String(error) })
    }
}


