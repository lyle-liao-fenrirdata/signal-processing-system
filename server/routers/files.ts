import { router, userProcedure } from '../trpc';
import { z } from 'zod';
import * as fs from 'node:fs/promises';
import path from 'path'
import { TRPCError } from '@trpc/server';

//     const images = filenames.map(name => path.join('/', dirRelativeToPublicFolder, name))

export type FilesRouter = typeof filesRouter;

export const filesRouter = router({
    getFiles: userProcedure
        .input(z.string().optional().default(""))
        .query(async ({ input: dirRelativeToMountFolder }) => {
            try {
                await fs.access('./public/mount', fs.constants.R_OK)
            } catch (e) {
                console.error('Path: ./public/mount is not accessible (R).')
                await fs.mkdir('./public/mount')
            }

            const dir = path.resolve('./public/mount', dirRelativeToMountFolder);
            try {
                await fs.access(dir, fs.constants.R_OK)
            } catch (e) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Path: ${dirRelativeToMountFolder} 不存在，或不可讀取。`,
                })
            }
            const filenames = await fs.readdir(dir, {
                withFileTypes: true,
            });
            return {
                files: filenames.filter((dirent) => dirent.isFile()),
                dirs: filenames.filter((dirent) => dirent.isDirectory()),
            };
        })
});

// const JSON_format_from_Zack_in_Line_group = {
//     "InputPort": 1,
//     "OutputPort": 1,
//     "LinkID": {
//         "SatelliteID": "AA",
//         "Polarization": "V",
//         "Frequency": 12500250000
//     },
//     "ServerIP": "192.168.016.101",
//     "ServerPort": 1234,
//     "ServerCh": 1,
//     "ServerType": "HDLC/DVB/IP",
//     "Timestamp": UnixTime(seconds),
//     "Capture": "Enable/Disable"
//     "RecordId": "CCV1250025000_YYYYMMDDHHmmssfff"
// }