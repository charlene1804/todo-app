import request from "supertest"
import { describe, expect, it } from "vitest"
import { createApp } from "../src/createApp.js"

describe("auth body validation", () => {
    it("rejects register with invalid email", async () => {
        const app = createApp()
        const res = await request(app).post("/auth/register").send({
            email: "not-an-email",
            password: "12345678",
        })
        expect(res.status).toBe(400)
        expect(res.body.error).toBe("Invalid email")
    })

    it("rejects register with short password", async () => {
        const app = createApp()
        const res = await request(app).post("/auth/register").send({
            email: "a@b.co",
            password: "short",
        })
        expect(res.status).toBe(400)
        expect(res.body.error).toBe("Password must be at least 8 characters")
    })

    it("rejects login with malformed body", async () => {
        const app = createApp()
        const res = await request(app).post("/auth/login").send({
            email: "",
            password: "anything",
        })
        expect(res.status).toBe(400)
    })
})

describe("todos auth", () => {
    it("rejects GET /todos without Authorization", async () => {
        const app = createApp()
        const res = await request(app).get("/todos")
        expect(res.status).toBe(401)
    })
})
