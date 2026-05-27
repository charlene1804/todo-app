import jwt from "jsonwebtoken"

export type AuthTokenPayload = {
    userId: string
    email: string
}

function jwtSecret(): string {
    const s = process.env.JWT_SECRET
    if (!s) {
        throw new Error("JWT_SECRET is not set")
    }
    return s
}

export function signAuthToken(payload: AuthTokenPayload): string {
    return jwt.sign(
        { userId: payload.userId, email: payload.email },
        jwtSecret(),
        { expiresIn: "7d" }
    )
}

export function verifyAuthToken(token: string): AuthTokenPayload {
    const decoded = jwt.verify(token, jwtSecret())
    if (typeof decoded === "string" || typeof decoded !== "object" || !decoded) {
        throw new Error("Invalid token")
    }
    const o = decoded as Record<string, unknown>
    const userId = o.userId
    const email = o.email
    if (typeof userId !== "string" || typeof email !== "string") {
        throw new Error("Invalid token")
    }
    return { userId, email }
}
