import { env } from '@/env.mjs';
import { router, publicProcedure, authProcedure } from '../trpc';
// import { Prisma } from '@prisma/client';
// import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// Export type router type signature,
// NOT the router itself.
export type ArkimeRouter = typeof arkimeRouter;

export const arkimeRouter = router({
    searchPayload: authProcedure.input(z.object({
        host: z.string(),
        port: z.string(),
        query: z.string(),
        stopTime: z.string().nullable(),
        startTime: z.string().nullable(),
        arkime_node: z.string().nullable(),
        ip_src: z.string(),
    })).query(async ({ input: { host, port, query, stopTime, startTime, arkime_node, ip_src } }) => {
        // const client = new DigestClient('admin', '1qaz2wsx', { algorithm: 'MD5' })
        /**
         * http://192.168.15.13:8000/arkime_api/payload/?
         *      host=http://192.168.15.21&
         *      port=8005&
         *      query=好嗎&
         *      arkime_node=arkime01-node&
         *      ip_src=192.168.15.31
         */
        const url = new URL("/arkime_api/payload/", `${env.NEXT_PUBLIC_ARKIME_URL}:${env.NEXT_PUBLIC_ARKIME_PORT}`);
        url.searchParams.append("host", host);
        url.searchParams.append("port", port);
        url.searchParams.append("query", query);
        if (stopTime) {
            url.searchParams.append("stopTime", stopTime);
        }
        if (startTime) {
            url.searchParams.append("startTime", startTime);
        }
        if (arkime_node) {
            url.searchParams.append("arkime_node", arkime_node);
        }
        url.searchParams.append("ip_src", ip_src);

        const response = await fetch(url, { method: "GET" })
        return await response.json()
    })
});

// import { prisma } from '@/server/prisma';

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @see https://github.com/prisma/prisma/issues/9353
 */
// const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
//     id: true,
//     title: true,
//     text: true,
//     createdAt: true,
//     updatedAt: true,
// });
// export const postRouter = router({
//     list: publicProcedure
//         .input(
//             z.object({
//                 limit: z.number().min(1).max(100).nullish(),
//                 cursor: z.string().nullish(),
//             }),
//         )
//         .query(async ({ input }) => {
//             /**
//              * For pagination docs you can have a look here
//              * @see https://trpc.io/docs/useInfiniteQuery
//              * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
//              */

//             const limit = input.limit ?? 50;
//             const { cursor } = input;

//             const items = await prisma.post.findMany({
//                 select: defaultPostSelect,
//                 // get an extra item at the end which we'll use as next cursor
//                 take: limit + 1,
//                 where: {},
//                 cursor: cursor
//                     ? {
//                         id: cursor,
//                     }
//                     : undefined,
//                 orderBy: {
//                     createdAt: 'desc',
//                 },
//             });
//             let nextCursor: typeof cursor | undefined = undefined;
//             if (items.length > limit) {
//                 // Remove the last item and use it as next cursor

//                 const nextItem = items.pop()!;
//                 nextCursor = nextItem.id;
//             }

//             return {
//                 items: items.reverse(),
//                 nextCursor,
//             };
//         }),
//     byId: publicProcedure
//         .input(
//             z.object({
//                 id: z.string(),
//             }),
//         )
//         .query(async ({ input }) => {
//             const { id } = input;
//             const post = await prisma.post.findUnique({
//                 where: { id },
//                 select: defaultPostSelect,
//             });
//             if (!post) {
//                 throw new TRPCError({
//                     code: 'NOT_FOUND',
//                     message: `No post with id '${id}'`,
//                 });
//             }
//             return post;
//         }),
//     add: publicProcedure
//         .input(
//             z.object({
//                 id: z.string().uuid().optional(),
//                 title: z.string().min(1).max(32),
//                 text: z.string().min(1),
//             }),
//         )
//         .mutation(async ({ input }) => {
//             const post = await prisma.post.create({
//                 data: input,
//                 select: defaultPostSelect,
//             });
//             return post;
//         }),
// });