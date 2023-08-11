import { z } from 'zod';
import { loginUserSchema, passwordSchema } from './auth.schema';
import { Role } from '@prisma/client';

export const updateUserBaseSchema = loginUserSchema.pick({ account: true })

export const updateUserRoleSchema = updateUserBaseSchema.extend({
    role: z.enum([Role.GUEST, Role.USER, Role.ADMIN], {
        errorMap: () => ({ message: `Role 僅可為 ${Role.GUEST}、${Role.USER}、或${Role.ADMIN}` })
    }),
    deletedAt: z.nullable(z.date())
})

export const resetUserPasswordSchema = updateUserBaseSchema.merge(passwordSchema).extend({
    passwordConfirm: passwordSchema.shape.password
}).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "兩次密碼輸入不同",
});


export type UpdateUserBaseInput = z.infer<typeof updateUserBaseSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;