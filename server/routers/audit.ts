import { TRPCError } from '@trpc/server';
import { prisma } from '../prisma';
import { router, userProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { auditDescriptionSchema, auditIsCheckedSchema, auditLockSchema } from '../schema/audit.schema';

// Export type router type signature,
// NOT the router itself.
export type AuditRouter = typeof auditRouter;

export const auditRouter = router({
    getLiveAudit: userProcedure
        .query(async () => { return await getLiveAudit() }),
    getUserAuditLog: userProcedure
        .query(async ({ ctx: { user: { account } } }) => {
            return await prisma.auditLog.findMany({
                where: {
                    user: { account },
                },
                include: {
                    audit: true,
                    auditGroupLogs: {
                        include: {
                            auditGroup: true,
                            auditItemLogs: {
                                include: {
                                    auditItem: true,
                                }
                            },
                        }
                    }
                }
            })
        }),
    createNewAuditLog: userProcedure
        .mutation(async ({ ctx: { user: { account } } }) => {
            const [user, historyAudit, audit] = await Promise.all([
                await prisma.user.findUnique({ where: { account }, select: { id: true } }),
                await prisma.auditLog.findFirst({
                    where: {
                        user: {
                            account
                        },
                        isLocked: false
                    }
                }),
                await getLiveAudit(),
            ])
            if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "錯誤！ 沒有此使用者。" });
            if (historyAudit) throw new TRPCError({ code: "CONFLICT", message: "尚有未完成紀錄，請先結案提交。" });
            if (!audit) throw new TRPCError({ code: "NOT_FOUND", message: "錯誤！ 可使用的表單，請聯繫管理者。" });

            await prisma.auditLog.create({
                data: {
                    userId: user.id,
                    auditId: audit.id,
                    auditGroupLogs: {
                        create: audit.auditGroups.map(g => ({
                            auditGroupId: g.id,
                            auditItemLogs: {
                                create: g.auditItems.map(i => ({ auditItemId: i.id }))
                            }
                        }))
                    }
                }
            })

            return { ok: true };
        }),
    lockAuditLog: userProcedure
        .input(auditLockSchema)
        .mutation(async ({ ctx: { user: { account } }, input: { id, isLocked } }) => {
            const auditLog = await prisma.auditLog.findUnique({
                where: {
                    id,
                },
                select: {
                    isLocked: true,
                    user: {
                        select: {
                            account: true
                        }
                    }
                },
            })
            if (!auditLog || auditLog.user.account !== account) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (auditLog.isLocked) throw new TRPCError({ code: "CONFLICT", message: "資料已提交，且鎖定，不可變更。" });
            if (auditLog.isLocked === isLocked) throw new TRPCError({ code: "BAD_REQUEST", message: "沒有內容變更。" });

            await prisma.auditLog.update({
                where: {
                    id,
                },
                data: {
                    isLocked,
                }
            })

            return { ok: true };

        }),
    saveAuditLog: userProcedure
        .input(auditDescriptionSchema)
        .mutation(async ({ ctx: { user: { account } }, input: { id, description } }) => {
            const auditLog = await prisma.auditLog.findUnique({
                where: {
                    id,
                },
                select: {
                    isLocked: true,
                    description: true,
                    user: {
                        select: {
                            account: true
                        }
                    }
                },
            });
            if (!auditLog || auditLog.user.account !== account) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (auditLog.isLocked) throw new TRPCError({ code: "CONFLICT", message: "資料已提交，且鎖定，不可變更。" });
            if (auditLog.description === description) throw new TRPCError({ code: "BAD_REQUEST", message: "沒有內容變更。" });

            await prisma.auditLog.update({
                where: {
                    id,
                },
                data: {
                    description,
                }
            });

            return { ok: true };
        }),
    saveAuditGroupLog: userProcedure
        .input(auditDescriptionSchema)
        .mutation(async ({ ctx: { user: { account } }, input: { id, description } }) => {
            const auditGroupLog = await prisma.auditGroupLog.findUnique({
                where: {
                    id,
                },
                select: {
                    auditLog: {
                        select: {
                            isLocked: true,
                            user: {
                                select: {
                                    account: true
                                }
                            }
                        }
                    },
                    description: true,
                },
            });
            if (!auditGroupLog || auditGroupLog.auditLog.user.account !== account) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (auditGroupLog.auditLog.isLocked) throw new TRPCError({ code: "CONFLICT", message: "資料已提交，且鎖定，不可變更。" });
            if (auditGroupLog.description === description) throw new TRPCError({ code: "BAD_REQUEST", message: "沒有內容變更。" });

            await prisma.auditGroupLog.update({
                where: {
                    id,
                },
                data: {
                    description,
                }
            });

            return { ok: true };
        }),
    suaveAuditItemLog: userProcedure
        .input(auditIsCheckedSchema)
        .mutation(async ({ ctx: { user: { account } }, input: { id, isChecked } }) => {
            const auditItemLog = await prisma.auditItemLog.findUnique({
                where: {
                    id,
                },
                select: {
                    auditGroupLog: {
                        select: {
                            auditLog: {
                                select: {
                                    isLocked: true,
                                    user: {
                                        select: {
                                            account: true
                                        }
                                    }
                                }
                            },
                        }
                    },
                    isChecked: true,
                },
            });
            if (!auditItemLog || auditItemLog.auditGroupLog.auditLog.user.account !== account) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (auditItemLog.auditGroupLog.auditLog.isLocked) throw new TRPCError({ code: "CONFLICT", message: "資料已提交，且鎖定，不可變更。" });
            if (auditItemLog.isChecked === isChecked) throw new TRPCError({ code: "BAD_REQUEST", message: "沒有內容變更。" });

            await prisma.auditItemLog.update({
                where: {
                    id,
                },
                data: {
                    isChecked,
                }
            });

            return { ok: true };
        }),
});

async function getLiveAudit() {
    const audit = await prisma.audit.findFirst({
        where: {
            isActive: true,
            deletedAt: null
        },
        include: {
            auditGroups: {
                include: {
                    auditItems: true,
                }
            },
            createdBy: {
                select: {
                    username: true,
                }
            }
        }
    })

    return audit
}