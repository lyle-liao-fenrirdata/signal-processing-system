/**
 * This file contains the root router of your tRPC-backend
 */
import { env } from '@/env.mjs';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { arkimeRouter } from './arkime';
import { recordingRouter } from './recording';
import { authRouter } from './auth';

export const appRouter = router({
    auth: authRouter,
    arkime: arkimeRouter,
    sqlTranslate: publicProcedure.input(z.object({
        query: z.string(),
        fetch_size: z.number().min(1)
    })).query(async ({ input }) => {
        const res = await fetch(`${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_ELASTIC_PORT}/_sql/translate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(input),
        });
        return await res.json()
    }),
    recording: recordingRouter,
});

export type AppRouter = typeof appRouter;