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
        return NextResponse.error()
    }
    const dirFiles = await fs.readdir(dir, {
        withFileTypes: true,
    });
    const files = await Promise.all(dirFiles.filter((dirent) => dirent.isFile()).map(async (dirent) => {
        const { birthtimeMs, size } = await fs.stat(`${dir}${dirent.name}`)
        return { birthtimeMs, size, name: dirent.name }
    }));
    // const files = dirFiles.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
    const dirs = await Promise.all(dirFiles.filter((dirent) => dirent.isDirectory()).map(async (dirent) => {
        const dirDirent = await fs.readdir(`${dir}${dirent.name}`, {
            withFileTypes: true,
        });
        const nfiles = dirDirent.filter((dirent) => dirent.isFile()).length
        const ndirs = dirDirent.filter((dirent) => dirent.isDirectory()).length
        return { nfiles, ndirs, name: dirent.name }
    }));
    return NextResponse.json({
        files,
        dirs,
    });
}

export async function POST(request: Request) {
    const data = await request.formData()
    const dir: string = data.get('dir') as string
    const file: File | null = data.get('file') as unknown as File

    if (!file || !dir) {
        return NextResponse.json({ ok: false })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const path = `${dir.replace('home/', './public/mount/')}${file.name}`;

    // check if file already exist
    try {
        await fs.access(path, fs.constants.F_OK)
        return NextResponse.json({ ok: false })
    } catch { }
    await fs.writeFile(path, buffer)
    return NextResponse.json({ ok: true })
}

export async function PUT(request: Request) {
    const dirname = await request.text()
    if (!dirname) return NextResponse.json({ ok: false });

    const path = dirname.replace('home/', './public/mount/');

    // check if file already exist
    try {
        await fs.access(path, fs.constants.F_OK)
        return NextResponse.json({ ok: false })
    } catch { }
    await fs.mkdir(path, { recursive: true })
    return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const dirToDel = searchParams.get('dirToDel')

    if (!dirToDel) return NextResponse.json({ ok: false });

    const dirname = decodeURIComponent(dirToDel);
    const path = dirname.replace('home/', './public/mount/');

    // check if file already exist
    try {
        await fs.access(path, fs.constants.F_OK)
    } catch {
        return NextResponse.json({ ok: false })
    }

    if (dirname.charAt(dirname.length - 1) === '/') {
        await fs.rmdir(path, { recursive: true })
    } else {
        await fs.rm(path, { recursive: true })
    }
    return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
    let oldPath: string = "";
    let newPath: string = "";
    try {
        const body = await request.json()
        oldPath = body.oldPath
        newPath = body.newPath
    } catch {
        return NextResponse.json({ ok: false })
    }
    console.log("\x1b[43m", { oldPath, newPath }, "\x1b[0m");

    if (!oldPath || !newPath) {
        return NextResponse.json({ ok: false })
    }

    oldPath = oldPath.replace('home/', './public/mount/');
    newPath = newPath.replace('home/', './public/mount/');

    // check if new dir not exist
    try {
        await fs.access(newPath, fs.constants.F_OK)
        return NextResponse.json({ ok: false })
    } catch { }
    // check if old dir already exist
    try {
        await fs.access(oldPath, fs.constants.F_OK)
    } catch {
        return NextResponse.json({ ok: false })
    }
    await fs.rename(oldPath, newPath)
    return NextResponse.json({ ok: true })
}

// console.log("\x1b[43m", dir, "\x1b[0m");
