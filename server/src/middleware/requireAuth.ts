import type { NextFunction, Request, Response } from "express"
import { verifyAuthToken } from "../auth/tokens.js"

export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const raw = req.headers.authorization
    if (!raw?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" })
        return
    }
    const token = raw.slice(7)
    try {
        req.auth = verifyAuthToken(token)
        next()
    } catch {
        res.status(401).json({ error: "Unauthorized" })
    }
}
