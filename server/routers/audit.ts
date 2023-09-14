import { TRPCError } from '@trpc/server';
import { prisma } from '../prisma';
import { adminProcedure, router, userProcedure } from '../trpc';
import { auditCommentSchema, auditDescriptionSchema, auditGroupItemCommonSchema, auditGroupSchema, auditIdSchema, auditIsCheckedSchema, auditLockSchema } from '../schema/audit.schema';

export type AuditRouter = typeof auditRouter;

export const auditRouter = router({
    getLiveAudit: userProcedure
        .query(async () => { return await getLiveAudit() }),
    getUserActiveAuditLog: userProcedure
        .query(async ({ ctx: { user: { account } } }) => {
            return await prisma.auditLog.findMany({
                take: 10,
                where: {
                    user: { account },
                    isLocked: false,
                },
                include: {
                    audit: true,
                    auditGroupLogs: {
                        include: {
                            auditGroup: true,
                            auditItemLogs: {
                                include: {
                                    auditItem: true,
                                },
                                orderBy: {
                                    auditItem: {
                                        order: 'asc'
                                    },
                                }
                            },
                        },
                        orderBy: {
                            auditGroup: {
                                order: 'asc',
                            }
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc',
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
            if (!audit) throw new TRPCError({ code: "NOT_FOUND", message: "錯誤！ 沒有可使用的表單，請聯繫管理者。" });

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
    saveAuditItemLog: userProcedure
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
    getUserHistoryAuditLog: userProcedure
        .query(async ({ ctx: { user: { account } } }) => {
            return await prisma.auditLog.findMany({
                take: 10,
                where: {
                    user: { account },
                    isLocked: true,
                },
                include: {
                    audit: true,
                    auditGroupLogs: {
                        include: {
                            auditGroup: true,
                            auditItemLogs: {
                                include: {
                                    auditItem: true,
                                },
                                orderBy: {
                                    auditItem: {
                                        order: 'asc'
                                    },
                                }
                            },
                        },
                        orderBy: {
                            auditGroup: {
                                order: 'asc',
                            }
                        }
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                }
            })
        }),
    getAllAudit: adminProcedure
        .query(async () => {

            const audit = await prisma.audit.findMany({
                where: {
                    deletedAt: null
                },
                include: {
                    auditGroups: {
                        include: {
                            auditItems: {
                                orderBy: {
                                    order: 'asc'
                                },
                            }
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    },
                    createdBy: {
                        select: {
                            username: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            })

            return audit
        }),
    createNewAudit: adminProcedure
        .mutation(async ({ ctx: { user: { account } } }) => {
            const [user, historyAudit, audit] = await Promise.all([
                await prisma.user.findUnique({ where: { account }, select: { id: true } }),
                await prisma.audit.findMany({
                    take: 1,
                    where: {
                        createdBy: {
                            account
                        },
                        deletedAt: null,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    }
                }),
                await getLiveAudit(),
            ])
            if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "錯誤！ 沒有此使用者。" });
            if (historyAudit?.[0] && !historyAudit[0].isActive) throw new TRPCError({ code: "CONFLICT", message: "尚有未完成編輯，請先刪除。" });
            if (!audit) throw new TRPCError({ code: "NOT_FOUND", message: "錯誤！ 沒有可使用的表單，請聯繫管理者。" });

            await prisma.audit.create({
                data: {
                    createdById: user.id,
                    comment: audit.comment,
                    auditGroups: {
                        create: audit.auditGroups.map(({ name, order, color, auditItems }) => ({
                            name,
                            order,
                            color,
                            auditItems: {
                                create: auditItems.map(({ name, order }) => ({ name, order }))
                            }
                        }))
                    }
                }
            })

            return { ok: true };
        }),
    deleteAudit: adminProcedure
        .input(auditIdSchema)
        .mutation(async ({ ctx: { user: { account } }, input: { id } }) => {
            const audit = await prisma.audit.findUnique({
                where: {
                    id,
                },
            })
            if (!audit) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (audit.deletedAt) throw new TRPCError({ code: "CONFLICT", message: "資料已刪除，不可操作。" });

            await prisma.audit.update({
                where: {
                    id,
                },
                data: {
                    deletedAt: new Date(),
                }
            })

            return { ok: true };
        }),

    activateAudit: adminProcedure
        .input(auditIdSchema)
        .mutation(async ({ input: { id } }) => {
            const audit = await prisma.audit.findUnique({
                where: {
                    id,
                },
            })
            if (!audit) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (audit.deletedAt) throw new TRPCError({ code: "CONFLICT", message: "資料已刪除，不可操作。" });

            await prisma.audit.updateMany({
                where: {
                    isActive: true,
                },
                data: {
                    isActive: false,
                }
            })
            await prisma.audit.update({
                where: {
                    id,
                },
                data: {
                    isActive: true,
                }
            })

            return { ok: true };
        }),
    saveAudit: adminProcedure
        .input(auditCommentSchema)
        .mutation(async ({ input: { id, comment } }) => {
            const audit = await prisma.audit.findUnique({
                where: {
                    id,
                },
            });
            if (!audit) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (audit.deletedAt) throw new TRPCError({ code: "CONFLICT", message: "資料已刪除，不可操作。" });
            console.log(audit.comment, audit.comment === comment ? "===" : "!==", comment)
            if (audit.comment === comment) throw new TRPCError({ code: "BAD_REQUEST", message: "沒有內容變更。" });

            await prisma.audit.update({
                where: {
                    id,
                },
                data: {
                    comment,
                }
            });

            return { ok: true };
        }),
    saveAuditGroup: adminProcedure
        .input(auditGroupSchema)
        .mutation(async ({ input: { id, color, name, order } }) => {
            const auditGroup = await prisma.auditGroup.findUnique({
                where: {
                    id,
                },
                include: {
                    audit: {
                        select: {
                            deletedAt: true,
                        }
                    }
                }
            });
            if (!auditGroup) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (auditGroup.audit.deletedAt) throw new TRPCError({ code: "CONFLICT", message: "資料已刪除，不可操作。" });
            if (auditGroup.color === color && auditGroup.name === name && auditGroup.order === order) throw new TRPCError({ code: "BAD_REQUEST", message: "沒有內容變更。" });

            await prisma.auditGroup.update({
                where: {
                    id,
                },
                data: {
                    color,
                    name,
                    order
                }
            });

            return { ok: true };
        }),
    saveAuditItem: adminProcedure
        .input(auditGroupItemCommonSchema)
        .mutation(async ({ input: { id, name, order } }) => {
            const auditItem = await prisma.auditItem.findUnique({
                where: {
                    id,
                },
                include: {
                    auditGroups: {
                        include: {
                            audit: {
                                select: {
                                    deletedAt: true,
                                }
                            }
                        }
                    }
                }
            });
            if (!auditItem) throw new TRPCError({ code: "NOT_FOUND", message: "紀錄不存在。" });
            if (auditItem.auditGroups.audit.deletedAt) throw new TRPCError({ code: "CONFLICT", message: "資料已刪除，不可操作。" });
            if (auditItem.name === name && auditItem.order === order) throw new TRPCError({ code: "BAD_REQUEST", message: "沒有內容變更。" });

            await prisma.auditItem.update({
                where: {
                    id,
                },
                data: {
                    name,
                    order
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