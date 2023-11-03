import { router, adminProcedure } from '../trpc';
import * as argon2 from "argon2";
import { prisma } from '@/server/prisma';
import { TRPCError } from '@trpc/server';
import { Role } from '.prisma/client';
import { resetUserPasswordSchema, updateUserBaseSchema, updateUserRoleSchema } from '../schema/permission.schema';

export type PermissionRouter = typeof permissionRouter;

export const permissionRouter = router({
    listall: adminProcedure
        .query(async () => {
            const users = await prisma.user.findMany({
                select: {
                    username: true,
                    account: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                }, orderBy: [
                    { deletedAt: "asc" },
                    { createdAt: 'desc' },
                ]
            });

            const guest = users.filter((u) => u.role === Role.GUEST && !u.deletedAt)
            const user = users.filter((u) => u.role === Role.USER && !u.deletedAt)
            const admin = users.filter((u) => u.role === Role.ADMIN && !u.deletedAt)
            const deleted = users.filter((u) => u.deletedAt)

            return { guest, user, admin, deleted }
        }),

    updateUserRole: adminProcedure
        .input(updateUserRoleSchema)
        .mutation(async ({ input: { role, deletedAt, account }, ctx: { user: { account: inputerAccount } } }) => {
            if (inputerAccount === account) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "不可變更自己的權限",
                })
            }
            const oldUser = await prisma.user.findUnique({ where: { account }, select: { role: true, deletedAt: true } })
            if (!oldUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "沒有此帳號",
                })
            }

            let updateDeletedAt: Date | null | undefined = undefined;
            let updateRole: Role | undefined = undefined;

            if ((oldUser.deletedAt && !deletedAt) || (!oldUser.deletedAt && deletedAt)) {
                updateDeletedAt = deletedAt || null
            }
            if (role && oldUser.role !== role) {
                updateRole = role
            }
            if (typeof updateDeletedAt === "undefined" && !updateRole) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "變更前/後的值相同，沒有變更的需要",
                })
            }

            await prisma.user.update({
                where: { account }, data: { role: updateRole || oldUser.role, deletedAt: updateDeletedAt }, select: {
                    account: true,
                    role: true,
                    deletedAt: true,
                }
            })

            return { ok: true }
        }),

    removeUser: adminProcedure
        .input(updateUserBaseSchema)
        .mutation(async ({ input: { account }, ctx: { user: { account: inputerAccount } } }) => {
            if (inputerAccount === account) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "不可移除自己的帳號",
                })
            }
            const oldUser = await prisma.user.findUnique({ where: { account }, select: { role: true, deletedAt: true } })
            if (!oldUser) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "沒有此帳號",
                })
            }

            if (!oldUser.deletedAt) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "請先將使者設定為靜止帳戶",
                })
            }

            const res = await prisma.user.delete({
                where: { account },
            })

            return { ok: true }
        }),

    resetPassword: adminProcedure
        .input(resetUserPasswordSchema)
        .mutation(async ({ input: { account, password }, ctx: { user: { account: inputerAccount } } }) => {
            if (inputerAccount === account) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "不可變更自己的密碼，請到「設定」變更",
                })
            }

            const oldUser = await prisma.user.findUnique({ where: { account }, select: { role: true, deletedAt: true } })
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
        }),
});
