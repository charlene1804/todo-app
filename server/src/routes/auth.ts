import bcrypt from "bcrypt"
import { Router } from "express"
import { signAuthToken } from "../auth/tokens.js"
import { requireAuth } from "../middleware/requireAuth.js"
import { prisma } from "../prisma.js"

export const authRouter = Router()

function parseCredentials(body: unknown): { email?: string; password?: string } {
    if (typeof body !== "object" || body === null) {
        return {}
    }
    const o = body as Record<string, unknown>
    return {
        email: typeof o.email === "string" ? o.email : undefined,
        password: typeof o.password === "string" ? o.password : undefined,
    }
}

authRouter.post("/register", async (req, res) => {
    const { email, password } = parseCredentials(req.body)
    const normalized = email?.trim().toLowerCase()
    if (!normalized || !normalized.includes("@")) {
        res.status(400).json({ error: "Invalid email" })
        return
    }
    if (!password || password.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters" })
        return
    }
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email: normalized, passwordHash },
            select: { id: true, email: true, createdAt: true },
        })
        const token = signAuthToken({ userId: user.id, email: user.email })
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
        })
    } catch (e) {
        if (
            typeof e === "object" &&
            e !== null &&
            "code" in e &&
            (e as { code: string }).code === "P2002"
        ) {
            res.status(409).json({ error: "Email already registered" })
            return
        }
        res.status(500).json({ error: "Registration failed" })
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = parseCredentials(req.body)
        const normalized = email?.trim().toLowerCase()
        if (!normalized || !password) {
            res.status(400).json({ error: "Invalid credentials" })
            return
        }
        const user = await prisma.user.findUnique({
            where: { email: normalized },
        })
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" })
            return
        }
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) {
            res.status(401).json({ error: "Invalid credentials" })
            return
        }
        const token = signAuthToken({ userId: user.id, email: user.email })
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.createdAt,
            },
        })
    } catch {
        res.status(500).json({ error: "Login failed" })
    }
})

authRouter.get("/me", requireAuth, (req, res) => {
    res.json({ userId: req.auth!.userId, email: req.auth!.email })
})
