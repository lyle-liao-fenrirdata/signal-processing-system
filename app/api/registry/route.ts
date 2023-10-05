import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";

// https://stackoverflow.com/questions/25436742/how-to-delete-images-from-a-private-docker-registry
// export async function DELETE(request: NextRequest) {
//     const data = await request.formData()
//     const repo = data.get('repo') as string
//     const tag = data.get('tag') as string

//     if (!tag || !repo) {
//         return new NextResponse(JSON.stringify({ ok: false }), { status: 400 })
//     }
//     const res = await fetch(`${env.REGISTRY_V2_URL}${repo}/manifests/${tag}`)

//     if (!res.ok) {
//         return new NextResponse(JSON.stringify({ ok: false }), { status: 400 })
//     }
//     const digest = res.headers.get('docker-content-digest')
//     // console.log("\x1b[43m", digest, "\x1b[0m");
//     // sha256:3b4055d9cb78bda659ffd442ac7239b77389aa8008468693a12fd7350ad1fefe
//     if (!digest) {
//         return new NextResponse(JSON.stringify({ ok: false }), { status: 400 })
//     }

//     const delRes = await fetch(`${env.REGISTRY_V2_URL}${repo}/manifests/${digest}`, { method: "DELETE" })
//     // console.log("\x1b[43m", await delRes.text(), "\x1b[0m");
//     // {"errors":[{"code":"UNSUPPORTED","message":"The operation is unsupported."}]}
//     if (!delRes.ok) {
//         return new NextResponse(JSON.stringify({ ok: false }), { status: 400 })
//     }

//     return NextResponse.json({ ok: true })
// }
