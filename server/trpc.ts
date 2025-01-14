/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { TRPCError, initTRPC } from '@trpc/server';
import { transformer } from '@/utils/transformer';
import { Context } from './context';
import { Role } from '@prisma/client';

const t = initTRPC.context<Context>().create({
    /**
     * @see https://trpc.io/docs/v10/data-transformers
     */
    transformer,
    /**
     * @see https://trpc.io/docs/v10/error-formatting
     */
    errorFormatter({ shape }) {
        return shape;
    },
});

/**
 * Create a router
 * @see https://trpc.io/docs/v10/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v10/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * @see https://trpc.io/docs/v10/middlewares
 */
export const middleware = t.middleware;

/**
 * @see https://trpc.io/docs/v10/merging-routers
 */
export const mergeRouters = t.mergeRouters;

const isAdmin = middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.user?.role) throw new TRPCError({ code: 'UNAUTHORIZED', message: '請先登入' });
    if (ctx.user.role !== Role.ADMIN) throw new TRPCError({ code: "FORBIDDEN", message: '權限不足' });
    return opts.next({
        ctx: {
            user: ctx.user,
        },
    });
});

export const adminProcedure = publicProcedure.use(isAdmin);

const isUser = middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.user?.role) throw new TRPCError({ code: 'UNAUTHORIZED', message: '請先登入' });
    if (ctx.user.role !== Role.ADMIN && ctx.user.role !== Role.USER) throw new TRPCError({ code: "FORBIDDEN", message: '權限不足' });
    return opts.next({
        ctx: {
            user: ctx.user,
        },
    });
});

export const userProcedure = publicProcedure.use(isUser);

const isLogin = middleware(async (opts) => {
    const { ctx } = opts;
    if (!ctx.user?.role) throw new TRPCError({ code: 'UNAUTHORIZED', message: '請先登入' });
    return opts.next({
        ctx: {
            user: ctx.user,
        },
    });
});

export const loginProcedure = publicProcedure.use(isLogin);