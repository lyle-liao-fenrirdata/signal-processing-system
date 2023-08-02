import { z } from 'zod';

export const loginUserSchema = z.object({
    username: z.string().min(1, "使用者名稱不可空白").max(100),
    password: z.string()
        .min(1, "密碼不可空白")
        .min(6, "密碼至至少6個字元")
        .max(32, "密碼至至多32個字元"),
});

export const registerUserSchema = loginUserSchema.and(z.object({
    passwordConfirm: z.string()
        .min(1, "密碼不可空白")
        .min(6, "密碼至至少6個字元")
        .max(32, "密碼至至多32個字元"),
})).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "兩次密碼輸入不同",
});

export const tokenSchema = z.string().regex(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/);

export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type TokenSchema = z.infer<typeof tokenSchema>;