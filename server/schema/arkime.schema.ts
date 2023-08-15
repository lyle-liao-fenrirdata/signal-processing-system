import { z } from 'zod';

export const arkimeSearchSessionSchema = z.object({
    host: z.string(),
    arkime_node: z.string(),
    expression: z.string(),
})


export type ArkimeSearchSessionInput = z.infer<typeof arkimeSearchSessionSchema>;