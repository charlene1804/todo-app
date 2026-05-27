import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth.js"
import { prisma } from "../prisma.js"
import {
    createTodoBodySchema,
    patchTodoBodySchema,
} from "../validation/schemas.js"
import { formatZodError } from "../validation/zodError.js"

export const todosRouter = Router()

todosRouter.use(requireAuth)

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
    const parsed = createTodoBodySchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ error: formatZodError(parsed.error) })
        return
    }
    const { title } = parsed.data
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
    const parsed = patchTodoBodySchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ error: formatZodError(parsed.error) })
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
