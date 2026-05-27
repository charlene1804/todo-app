import { apiBaseUrl } from "../env"

export type AuthUser = {
    id: string
    email: string
    createdAt: string
}

export type AuthSuccess = {
    token: string
    user: AuthUser
}

export class AuthRequestError extends Error {
    readonly status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

async function authPost(
    path: string,
    body: { email: string; password: string }
): Promise<AuthSuccess> {
    const base = apiBaseUrl()
    if (!base) {
        throw new AuthRequestError(0, "VITE_API_URL が未設定です")
    }
    const res = await fetch(`${base}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const text = await res.text()
    if (!res.ok) {
        let message = res.statusText || "Request failed"
        if (text) {
            try {
                const parsed = JSON.parse(text) as { error?: string }
                if (typeof parsed.error === "string") {
                    message = parsed.error
                }
            } catch {
                if (text.length < 200) message = text
            }
        }
        throw new AuthRequestError(res.status, message)
    }
    return JSON.parse(text) as AuthSuccess
}

export function loginRequest(
    email: string,
    password: string
): Promise<AuthSuccess> {
    return authPost("/auth/login", { email, password })
}

export function registerRequest(
    email: string,
    password: string
): Promise<AuthSuccess> {
    return authPost("/auth/register", { email, password })
}
