import bcrypt from "bcrypt"
import { Router } from "express"
import { signAuthToken } from "../auth/tokens.js"
import { requireAuth } from "../middleware/requireAuth.js"
import { prisma } from "../prisma.js"
import { loginBodySchema, registerBodySchema } from "../validation/schemas.js"
import { formatZodError } from "../validation/zodError.js"

export const authRouter = Router()

authRouter.post("/register", async (req, res) => {
    const parsed = registerBodySchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ error: formatZodError(parsed.error) })
        return
    }
    const { email, password } = parsed.data
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { email, passwordHash },
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
        const parsed = loginBodySchema.safeParse(req.body)
        if (!parsed.success) {
            res.status(400).json({ error: formatZodError(parsed.error) })
            return
        }
        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({
            where: { email },
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
