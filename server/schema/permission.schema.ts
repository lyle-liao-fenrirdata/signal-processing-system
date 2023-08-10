import { z } from 'zod';
import { loginUserSchema } from './auth.schema';
import { Role } from '@prisma/client';

export const updateUserBaseSchema = loginUserSchema.pick({ account: true })

export const updateUserRoleSchema = updateUserBaseSchema.extend({
    role: z.enum([Role.GUEST, Role.USER, Role.ADMIN], {
        errorMap: () => ({ message: `Role 僅可為 ${Role.GUEST}、${Role.USER}、或${Role.ADMIN}` })
    }),
    deletedAt: z.nullable(z.date())
})


export type UpdateUserBaseInput = z.infer<typeof updateUserBaseSchema>;
export type UpdateUserRoleSchema = z.infer<typeof updateUserRoleSchema>;