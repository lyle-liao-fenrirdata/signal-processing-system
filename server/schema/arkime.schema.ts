import { z } from 'zod';

export const arkimeSearchSessionSchema = z.object({
    host: z.string().min(1, "請選擇 Host IP"),
    arkime_node: z.string().min(1, "請選擇 Capturer Hostname"),
    expression: z.string().min(1, "搜尋內容不可空白"),
})


export type ArkimeSearchSessionInput = z.infer<typeof arkimeSearchSessionSchema>;