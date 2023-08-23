import { router, publicProcedure, userProcedure, loginProcedure } from '../trpc';
// import { Prisma } from '@prisma/client';
import * as argon2 from "argon2";
import { prisma } from '@/server/prisma';
import { TRPCError } from '@trpc/server';
import { loginUserSchema, registerUserSchema, updateUserSchema } from '../schema/auth.schema';
import { getCookie, signUserJWT } from '@/utils/jwt';
import { resetUserPasswordSchema } from '../schema/permission.schema';

// Export type router type signature,
// NOT the router itself.
export type AuthRouter = typeof authRouter;

export const authRouter = router({
    register: publicProcedure
        .input(registerUserSchema)
        .mutation(async ({ input: { username, account, password }, ctx }) => {
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
                    account,
                    password: hashedPassword,
                },
            });

            const token = await signUserJWT({ username: newUser.username, account: newUser.account, role: newUser.role })
            const cookie = getCookie(token);
            ctx.res.setHeader('Set-Cookie', cookie);
            return { ok: true };
        }),
    login: publicProcedure
        .input(loginUserSchema)
        .mutation(async ({ input: { account, password }, ctx }) => {
            const user = await prisma.user.findUnique({
                where: { account },
                select: {
                    username: true,
                    account: true,
                    password: true,
                    role: true,
                    deletedAt: true,
                }
            })

            if (!user || !(await argon2.verify(user.password, password))) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "使用者名稱或密碼不正確",
                });
            }

            if (user.deletedAt) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "帳號已被設定為靜止障戶",
                });
            }

            const token = await signUserJWT({ username: user.username, account: user.account, role: user.role })
            const cookie = getCookie(token)
            ctx.res.setHeader('Set-Cookie', cookie);
            return { ok: true };
        }),
    logout: publicProcedure
        .mutation(async ({ ctx }) => {
            ctx.res.setHeader('Set-Cookie', `x-token=; Path=/; HttpOnly;expires=${new Date().toUTCString()};SameSite=Strict`);
            return { ok: true };
        }),
    getCookie: loginProcedure
        .query(async ({ ctx: { user: { username, account, role } } }) => {

            try {
                const token = await signUserJWT({ username, account, role })
                console.log(token)
                return { ok: true, token };
            } catch (error) {
                return { ok: false, error: String(error) }
            }
        }),
    getSelfInfo: loginProcedure
        .query(async ({ ctx: { user: { account } } }) => {
            const user = await prisma.user.findUnique({
                where: { account }, select: {
                    account: true,
                    username: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "無此使用者",
                })
            }

            return user;
        }),
    updateSelfInfo: loginProcedure
        .input(updateUserSchema)
        .mutation(async ({ ctx: { user: { account } }, input: { username } }) => {
            const user = await prisma.user.findUnique({
                where: { account }, select: {
                    username: true,
                }
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "無此使用者",
                })
            }

            if (user.username === username) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "沒有內容變更，無須更新",
                })
            }

            await prisma.user.update({
                where: { account },
                data: { username }
            })

            return { ok: true };
        }),
    updateSelfPassword: loginProcedure
        .input(resetUserPasswordSchema)
        .mutation(async ({ ctx: { user: { account: inputerAccount } }, input: { account, password } }) => {
            if (inputerAccount !== account) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "不可變更他人密碼",
                })
            }

            const oldUser = await prisma.user.findUnique({ where: { account }, select: { deletedAt: true } })
            if (!oldUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "沒有此帳號",
                })
            }

            if (oldUser.deletedAt) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "不可變更靜止帳戶密碼",
                })
            }

            const hashedPassword = await argon2.hash(password)
            await prisma.user.update({
                where: { account },
                data: {
                    password: hashedPassword,
                }
            })

            return { ok: true }
        })
    // getUserInfoByPayload: loginProcedure
    //     .query(async ({ ctx: { user } }) => {
    //         const { username, account, role } = user
    //         const trueUser = await prisma.user.findUnique({ where: { account }, select: { username: true, role: true, deletedAt: true } })
    //         if (!trueUser || Boolean(trueUser.deletedAt)) {
    //             throw new TRPCError({
    //                 code: "FORBIDDEN",
    //                 message: "無此使用者，或已為靜止戶",
    //             })
    //         }
    //         return { username, account, role }
    //     })
    // verify: authProcedure
    //     .query(async ({ ctx }) => {
    //         return { user: ctx.user };
    //     }),
    // refresh: authProcedure
    //     .query(async ({ ctx }) => {
    //         const { username, account, role } = ctx.user;
    //         const token = await signUserJWT({ username, account, role });
    //         const cookie = getCookie(token);
    //         ctx.res.setHeader('Set-Cookie', cookie);
    //         return { ok: true };
    //     }),
});
