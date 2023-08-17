import { prisma } from '../prisma';
import { router, loginProcedure, userProcedure } from '../trpc';

// Export type router type signature,
// NOT the router itself.
export type AuditRouter = typeof auditRouter;

export const auditRouter = router({
    getLiveAudit: userProcedure
        .query(async ({ ctx: { user: { account } } }) => {
            const user = await prisma.audit.findMany({
                where: {
                    isActive: true,
                    deletedAt: null
                },
                include: {
                    auditGroup: {
                        include: {
                            auditItem: true
                        }
                    }
                }
            })

            return user

        }),
});
