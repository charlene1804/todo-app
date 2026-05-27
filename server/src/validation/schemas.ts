import { z } from "zod"

export const registerBodySchema = z
    .object({
        email: z
            .string()
            .max(320)
            .email("Invalid email")
            .transform((s) => s.trim().toLowerCase()),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128),
    })
    .strict()

export const loginBodySchema = z
    .object({
        email: z
            .string()
            .max(320)
            .email("Invalid email")
            .transform((s) => s.trim().toLowerCase()),
        password: z.string().min(1, "Invalid credentials").max(128),
    })
    .strict()

export const createTodoBodySchema = z
    .object({
        title: z
            .string()
            .max(2000)
            .transform((s) => s.trim())
            .refine((s) => s.length > 0, { message: "Title is required" }),
    })
    .strict()

export const patchTodoBodySchema = z
    .object({
        title: z
            .string()
            .max(2000)
            .transform((s) => s.trim())
            .refine((s) => s.length > 0, { message: "Invalid title" })
            .optional(),
        completed: z.boolean().optional(),
    })
    .strict()
    .refine((d) => d.title !== undefined || d.completed !== undefined, {
        message: "No updates",
    })
