import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(3, "Username must be greater than 3 characgers")
    .max(20, "Username must be no more than 20 characters")
    .regex(/(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/gm, "Username must not include special characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).max(64, "Password must not exceed 64 characters"),
})