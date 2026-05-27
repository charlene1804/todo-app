import "dotenv/config"
import cors from "cors"
import express from "express"
import { authRouter } from "./routes/auth.js"
import { todosRouter } from "./routes/todos.js"

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

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})
