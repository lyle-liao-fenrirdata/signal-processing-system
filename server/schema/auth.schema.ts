import { z } from 'zod';

const accountSchema = z.object({
    account: z.string()
        .min(1, "帳號不可空白")
        .max(64, "最多64字元")
        .regex(/^[a-zA-Z0-9\.\-\_]*$/, "帳號僅可使用大小寫英文、數字、及 . - _ 等"),
})

const usernameSchame = z.object({
    username: z.string()
        .min(1, "使用者名稱不可空白")
        .max(18, "最多18字元")
})

export const passwordSchema = z.object({
    password: z.string()
        .min(1, "密碼不可空白")
        .min(6, "密碼至至少6個字元")
        .max(32, "密碼至至多32個字元"),
})

export const loginUserSchema = accountSchema.merge(passwordSchema)

export const registerUserSchema = loginUserSchema.merge(usernameSchame).merge(z.object({
    passwordConfirm: passwordSchema.shape.password
})).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "兩次密碼輸入不同",
});

export const updateUserSchema = usernameSchame

export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;