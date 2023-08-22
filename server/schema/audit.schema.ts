import { z } from 'zod';

const auditIdSchema = z.object({
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

export type AuditLockInput = z.infer<typeof auditLockSchema>;
export type AuditDescriptionInput = z.infer<typeof auditDescriptionSchema>;
export type AuditIsCheckedSchemaInput = z.infer<typeof auditIsCheckedSchema>;