import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { prisma } from "../prisma.js"

export const todosRouter = Router()

todosRouter.use(requireAuth)

function parseTitle(body: unknown): string | undefined {
    if (typeof body !== "object" || body === null) return undefined
    const o = body as Record<string, unknown>
    if (typeof o.title !== "string") return undefined
    const t = o.title.trim()
    return t.length > 0 ? t : undefined
}

type PatchData = { title?: string; completed?: boolean }

function parsePatch(body: unknown):
    | { ok: true; data: PatchData }
    | { ok: false; status: number; error: string } {
    if (typeof body !== "object" || body === null) {
        return { ok: false, status: 400, error: "Invalid body" }
    }
    const o = body as Record<string, unknown>
    const data: PatchData = {}
    if ("title" in o) {
        if (typeof o.title !== "string" || !o.title.trim()) {
            return { ok: false, status: 400, error: "Invalid title" }
        }
        data.title = o.title.trim()
    }
    if ("completed" in o) {
        if (typeof o.completed !== "boolean") {
            return { ok: false, status: 400, error: "Invalid completed" }
        }
        data.completed = o.completed
    }
    if (Object.keys(data).length === 0) {
        return { ok: false, status: 400, error: "No updates" }
    }
    return { ok: true, data }
}

const todoSelect = {
    id: true,
    title: true,
    completed: true,
    createdAt: true,
} as const

todosRouter.get("/", async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: { userId: req.auth!.userId },
        orderBy: { createdAt: "asc" },
        select: todoSelect,
    })
    res.json(todos)
})

todosRouter.post("/", async (req, res) => {
    const title = parseTitle(req.body)
    if (!title) {
        res.status(400).json({ error: "Title is required" })
        return
    }
    const todo = await prisma.todo.create({
        data: { title, userId: req.auth!.userId },
        select: todoSelect,
    })
    res.status(201).json(todo)
})

todosRouter.patch("/:id", async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400).json({ error: "Invalid id" })
        return
    }
    const parsed = parsePatch(req.body)
    if (!parsed.ok) {
        res.status(parsed.status).json({ error: parsed.error })
        return
    }
    const existing = await prisma.todo.findFirst({
        where: { id, userId: req.auth!.userId },
    })
    if (!existing) {
        res.status(404).json({ error: "Not found" })
        return
    }
    const todo = await prisma.todo.update({
        where: { id },
        data: parsed.data,
        select: todoSelect,
    })
    res.json(todo)
})

todosRouter.delete("/:id", async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400).json({ error: "Invalid id" })
        return
    }
    const result = await prisma.todo.deleteMany({
        where: { id, userId: req.auth!.userId },
    })
    if (result.count === 0) {
        res.status(404).json({ error: "Not found" })
        return
    }
    res.status(204).send()
})
