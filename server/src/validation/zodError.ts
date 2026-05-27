import type { ZodError } from "zod"

export function formatZodError(error: ZodError): string {
    const first = error.errors[0]
    if (!first) return "Invalid input"
    return first.message
}
