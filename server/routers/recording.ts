import { router, publicProcedure } from '../trpc';
// import { Prisma } from '@prisma/client';
// import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export type RecordingRouter = typeof recordingRouter;

export const recordingRouter = router({
    searchPayload: publicProcedure.input(z.object({
        InputPort: z.number(),
        OutputPort: z.number(),
        LinkID: z.object({
            SatelliteID: z.string(),
            Polarization: z.string(),
            Frequency: z.number(),
        }),
        ServerIP: z.string(),
        ServerPort: z.number(),
        ServerCh: z.number(),
        ServerType: z.string(),
        Timestamp: z.number(),
        Capture: z.string(),
        FileName: z.string(),
    })).query(async ({ input }) => {
        console.dir(input)
        return {}
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
//     "FileName": "CCV1250025000_YYYYMMDDHHmmssfff"
// }