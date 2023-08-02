import { router, publicProcedure } from '../trpc';
// import { Prisma } from '@prisma/client';
import * as argon2 from "argon2";
import { prisma } from '@/server/prisma';
import { TRPCError } from '@trpc/server';
import { loginUserSchema, registerUserSchema, tokenSchema } from '../schema/auth.schema';
import { signUserJWT } from '@/utils/jwt';

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
            const d = new Date();
            d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
            ctx.res.setHeader('Set-Cookie', `x-token=Bearer ${token}; Path=/; HttpOnly;expires=${d.toUTCString()};SameSite=Strict`);
            return { token: `Bearer ${token}` };
        }),
    login: publicProcedure
        .input(loginUserSchema)
        .query(async ({ input: { username, password }, ctx }) => {
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
            const d = new Date();
            d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
            ctx.res.setHeader('Set-Cookie', `x-token=Bearer ${token}; Path=/; HttpOnly;expires=${d.toUTCString()};SameSite=Strict`);
            return { token: `Bearer ${token}` };
        }),
    logout: publicProcedure
        .query(async ({ ctx }) => {
            ctx.res.setHeader('Set-Cookie', `x-token=; Path=/; HttpOnly;expires=${new Date().toUTCString()};SameSite=Strict`);
            return { ok: true };
        }),
    verify: publicProcedure
        .query(async ({ ctx }) => {
            if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: '請先登入' });
            return { user: ctx.user };
        }),
    refresh: publicProcedure
        .input(tokenSchema)
        .query(async ({ input, ctx }) => {
            if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: '請先登入' });
            const { username, role } = ctx.user;
            const token = await signUserJWT({ username, role });
            return { token: `Bearer ${token}` };
        }),
});
