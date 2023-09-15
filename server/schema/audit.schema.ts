import { Color, Role } from '@prisma/client';
import { z } from 'zod';

export const auditIdSchema = z.object({
    id: z.number(),
})

export const auditLockSchema = auditIdSchema.merge(z.object({
    isLocked: z.boolean(),
}))

export const auditDescriptionSchema = auditIdSchema.merge(z.object({
    description: z.string()
}))

export const auditIsCheckedSchema = auditIdSchema.merge(z.object({
    isChecked: z.boolean()
}))

export const auditCommentSchema = auditIdSchema.merge(z.object({
    comment: z.string(),
}))

export const auditGroupItemCommonSchema = auditIdSchema.merge(z.object({
    name: z.string(),
    order: z.number(),
}))

export const auditGroupSchema = auditGroupItemCommonSchema.merge(z.object({
    color: z.nativeEnum(Color)
}))

export const auditLogQuerySchema = z.object({
    account: z.string().optional(),
    role: z.nativeEnum(Role).optional(),
    createAtFrom: z.date().optional(),
    createAtTo: z.date().optional(),
    isLock: z.boolean().optional(),
    updatedAtFrom: z.date().optional(),
    updateAtTo: z.date().optional(),
})


export type AuditIdInput = z.infer<typeof auditIdSchema>;
export type AuditLockInput = z.infer<typeof auditLockSchema>;
export type AuditDescriptionInput = z.infer<typeof auditDescriptionSchema>;
export type AuditIsCheckedInput = z.infer<typeof auditIsCheckedSchema>;
export type AuditCommentInput = z.infer<typeof auditCommentSchema>;
export type AuditGroupItemCommonInput = z.infer<typeof auditGroupItemCommonSchema>;
export type AuditGroupInput = z.infer<typeof auditGroupSchema>;
export type AuditLogQueryInput = z.infer<typeof auditLogQuerySchema>;