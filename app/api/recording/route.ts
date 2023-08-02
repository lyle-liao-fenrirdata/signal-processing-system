import { env } from "@/env.mjs";
import { verifyUserJWT } from "@/utils/jwt";
import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { createSecretKey } from "node:crypto";

export async function GET(request: Request) {
    // const body = await request.json();
    const secretKey = createSecretKey("process.env.JWT_SECRET", 'utf-8');
    const secretKey2 = createSecretKey("processenvJWT_SECRET", 'utf-8');
    const token = await new SignJWT({ username: "user", role: 'USER' }) // details to  encode in the token
        .setProtectedHeader({ alg: 'HS256' }) // algorithm
        .setIssuedAt()
        .setIssuer("Fenrir Data Analysis") // issuer
        .setExpirationTime("1 day") // token expiration time, e.g., "1 day"
        .sign(secretKey); // secretKey generated from previous step
    const result = await verifyUserJWT(token);
    return NextResponse.json({ token, result });

    try {
        const res = await fetch(`${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_ELASTIC_PORT}/_sql/translate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            // body: JSON.stringify(body),
        });
        const data = await res.json()

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ status: 500, error })
    }

}

