import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)

        const url = searchParams.get('url')
        searchParams.delete('url')
        const path = searchParams.get('path')
        searchParams.delete('path')

        const result = await fetch(`https://${url}${path}&${searchParams.toString()}`);
        if (!result.ok) {
            console.log("\u001b[33m", result.statusText, "\u001b[0m")
            return NextResponse.json({ ok: false, error: result.statusText }, { status: result.status });
        }

        const data = await result.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ ok: false, error: String(error) }, { status: 400 })
    }
}



