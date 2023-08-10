/**
 * This file contains the root router of your tRPC-backend
 */
import { env } from '@/env.mjs';
import { z } from 'zod';
import { authProcedure, router } from '../trpc';
import { arkimeRouter } from './arkime';
import { recordingRouter } from './recording';
import { authRouter } from './auth';
import { permissionRouter } from './permission';

export const appRouter = router({
    auth: authRouter,
    arkime: arkimeRouter,
    sqlTranslate: authProcedure.input(z.object({
        query: z.string(),
        fetch_size: z.number().min(1)
    })).query(async ({ input }) => {
        const res = await fetch(`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_ELASTIC_PORT}/_sql/translate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(input),
        });
        return await res.json()
    }),
    recording: recordingRouter,
    permission: permissionRouter
});

export type AppRouter = typeof appRouter;