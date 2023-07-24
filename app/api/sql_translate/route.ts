import { env } from "@/env.mjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    try {
        const res = await fetch(`${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_ELASTIC_PORT}/_sql/translate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(body),
        });
        const data = await res.json()

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ status: 500, error })
    }

}