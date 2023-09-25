import * as fs from 'node:fs/promises';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    // try {
    //     const { searchParams } = new URL(request.url)
    //     const token = searchParams.get('token')
    //     if (!token) return NextResponse.json({ ok: false, error: "Expect 'token' query parameter." }, { status: 400 })

    //     const { payload, error } = await verifyUserJWT(token)
    //     if (error) return NextResponse.json({ ok: false, error: "Invalid token." }, { status: 401 })

    return NextResponse.json({ ok: true });
    // } catch (error) {
    //     return NextResponse.json({ ok: false, error: String(error) }, { status: 400 })
    // }
}

export async function POST(request: Request) {

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return NextResponse.json({ ok: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // With the file data in the buffer, you can do whatever you want with it.
    // For this, we'll just write it to the filesystem in a new location
    const path = `./public/mount/${file.name}`
    await fs.writeFile(path, buffer)
    // console.log(`open ${path} to see the uploaded file`)

    return NextResponse.json({ ok: true })
}




