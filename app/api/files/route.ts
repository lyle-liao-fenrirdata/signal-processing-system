import * as fs from 'node:fs/promises';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const inputDir = searchParams.get('dir') || 'home/'
    try {
        await fs.access('./public/mount', fs.constants.R_OK)
    } catch (e) {
        console.error('Path: ./public/mount is not accessible (R).')
        await fs.mkdir('./public/mount')
    }

    const dir = inputDir.replace('home/', './public/mount/');
    try {
        await fs.access(dir, fs.constants.R_OK)
    } catch (e) {
        return NextResponse.json({ files: [], dirs: [] })
    }
    const dirFiles = await fs.readdir(dir, {
        withFileTypes: true,
    });
    const files = dirFiles.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
    const dirs = dirFiles.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
    return NextResponse.json({
        files,
        dirs,
    });
}

export async function POST(request: Request) {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return NextResponse.json({ ok: false })
    }

    const bytes = await file.arrayBuffer()
    // With the file data in the buffer, you can do whatever you want with it.
    const buffer = Buffer.from(bytes)
    const path = `./public/mount/${file.name}`

    // check if file already exist
    try {
        await fs.access(path, fs.constants.F_OK)
        // if no throw error, then console.log(`file ${path} already exist`)
        return NextResponse.json({ ok: false })
    } catch { }
    // write it to the filesystem in a new location
    await fs.writeFile(path, buffer)
    // console.log(`open ${path} to see the uploaded file`)
    return NextResponse.json({ ok: true })
}

export async function PUT(request: Request) {
    const dirname = await request.text()
    if (!dirname) return NextResponse.json({ ok: false });

    const path = `./public/mount/${dirname}`

    // check if file already exist
    try {
        await fs.access(path, fs.constants.F_OK)
        // if no throw error, then console.log(`${path} already exist`)
        return NextResponse.json({ ok: false })
    } catch { }
    // write it to the filesystem in a new location
    await fs.mkdir(path, { recursive: true })
    // console.log(`open ${path} to see the uploaded file`)
    return NextResponse.json({ ok: true })
}




