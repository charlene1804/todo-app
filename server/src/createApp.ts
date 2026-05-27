import cors from "cors"
import express from "express"
import { authRouter } from "./routes/auth.js"
import { todosRouter } from "./routes/todos.js"

export function createApp() {
    const app = express()
    app.use(
        cors({
            origin: process.env.CLIENT_ORIGIN ?? true,
            credentials: true,
        })
    )
    app.use(express.json())

    app.get("/health", (_req, res) => {
        res.json({ ok: true })
    })

    app.use("/auth", authRouter)
    app.use("/todos", todosRouter)

    return app
}
