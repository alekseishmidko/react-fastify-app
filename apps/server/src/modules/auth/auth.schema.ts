import {  z } from 'zod'

const emailFiled = z
    .string()
    .trim()
    .pipe(z.email({ message: 'Некорректный email'}))
    .transform((value) => value.toLowerCase())

export const registerSchema = z.object({
    email: emailFiled,
    password: z.string().min(8, { message: 'Пароль минимум 8 символов' }),
    name: z.string().trim().min(2, { message: 'Имя минимум 2 символа'}).max(100)
})

export const loginSchema = z.object({
    email: emailFiled,
    password: z.string().min(1, { message: 'Пароль обязателен'})
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>