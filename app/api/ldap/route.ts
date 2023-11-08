import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/server/prisma';

export async function POST(request: NextRequest) {
    const data = await request.formData()
    const id = data.get('id') as string
    const ldap_url = data.get('ldap_url') as string

    if ((!ldap_url) || typeof ldap_url !== 'string') {
        return new NextResponse(JSON.stringify({ ok: false }), { status: 400 })
    }

    if (!id) {
        await prisma.lpad.create({
            data: {
                url: ldap_url
            }
        })
    } else {
        await prisma.lpad.update({
            where: {
                id,
            },
            data: {
                url: ldap_url
            }
        })
    }

    return NextResponse.json({ ok: true })
}
