/**
 * This file contains the root router of your tRPC-backend
 */
import { env } from '@/env.mjs';
import { z } from 'zod';
import { userProcedure, router } from '../trpc';
import { authRouter } from './auth';
import { permissionRouter } from './permission';
import { swarmRouter } from './swarm';
import { auditRouter } from './audit';
import { analyzerRouter } from './analyzer';

export const appRouter = router({
    auth: authRouter,
    sqlTranslate: userProcedure.input(z.object({
        query: z.string(),
        fetch_size: z.number().min(1)
    })).mutation(async ({ input }) => {
        try {
            const res = await fetch(`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_ELASTIC_PORT}/_sql/translate`, {
                method: "POST",
                headers: {
                    ApiKey: env.ES_READER_API_KEY,
                    "Content-Type": "application/json; charset=UTF-8",
                    'Authorization': `Basic ${btoa("reader:1qaz2wsx")}`
                },
                body: JSON.stringify(input),
            });
            return await res.json()
        } catch (error) {
            console.error("===================================")
            console.error(`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_ELASTIC_PORT}/_sql/translate`)
            console.error({ body: JSON.stringify(input) })
            console.error(error)
            console.error("===================================")
            return "can not translate"
        }
    }),
    permission: permissionRouter,
    swarm: swarmRouter,
    audit: auditRouter,
    analyzer: analyzerRouter,
});

export type AppRouter = typeof appRouter;