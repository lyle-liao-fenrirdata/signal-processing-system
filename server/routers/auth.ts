import { router, publicProcedure, authProcedure } from '../trpc';
// import { Prisma } from '@prisma/client';
import * as argon2 from "argon2";
import { prisma } from '@/server/prisma';
import { TRPCError } from '@trpc/server';
import { loginUserSchema, registerUserSchema, tokenSchema } from '../schema/auth.schema';
import { getCookie, signUserJWT } from '@/utils/jwt';

// Export type router type signature,
// NOT the router itself.
export type AuthRouter = typeof authRouter;

export const authRouter = router({
    register: publicProcedure
        .input(registerUserSchema)
        .mutation(async ({ input: { username, password }, ctx }) => {
            const user = await prisma.user.findUnique({ where: { username }, select: { id: true } })
            if (user) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "使用者已存在",
                })
            }
            const hashedPassword = await argon2.hash(password)
            const newUser = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                },
            });

            const token = await signUserJWT({ username: newUser.username, role: newUser.role })
            const cookie = getCookie(token);
            ctx.res.setHeader('Set-Cookie', cookie);
            return { ok: true };
        }),
    login: publicProcedure
        .input(loginUserSchema)
        .mutation(async ({ input: { username, password }, ctx }) => {
            const user = await prisma.user.findUnique({
                where: { username },
                select: {
                    password: true,
                    role: true
                }
            })

            if (!user || !(await argon2.verify(user.password, password))) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "使用者名稱或密碼不正確",
                });
            }

            const token = await signUserJWT({ username, role: user.role })
            const cookie = getCookie(token)
            ctx.res.setHeader('Set-Cookie', cookie);
            return { ok: true };
        }),
    logout: authProcedure
        .mutation(async ({ ctx }) => {
            ctx.res.setHeader('Set-Cookie', `x-token=; Path=/; HttpOnly;expires=${new Date().toUTCString()};SameSite=Strict`);
            return { ok: true };
        }),
    verify: authProcedure
        .query(async ({ ctx }) => {
            return { user: ctx.user };
        }),
    refresh: authProcedure
        .query(async ({ ctx }) => {
            const { username, role } = ctx.user;
            const token = await signUserJWT({ username, role });
            const cookie = getCookie(token);
            ctx.res.setHeader('Set-Cookie', cookie);
            return { ok: true };
        }),
});
