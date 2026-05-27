import { getAccessToken } from "./authToken"
import { apiBaseUrl } from "../env"

export class ApiError extends Error {
    readonly status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

export async function apiJson<T>(
    method: string,
    path: string,
    body?: unknown
): Promise<T> {
    const base = apiBaseUrl()
    if (!base) {
        throw new ApiError(0, "VITE_API_URL が未設定です")
    }
    const token = getAccessToken()
    if (!token) {
        throw new ApiError(401, "ログインが必要です")
    }
    const headers = new Headers()
    headers.set("Authorization", `Bearer ${token}`)
    if (body !== undefined) {
        headers.set("Content-Type", "application/json")
    }
    const res = await fetch(`${base}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
    })
    if (!res.ok) {
        let message = res.statusText || "Request failed"
        const text = await res.text()
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
        throw new ApiError(res.status, message)
    }
    if (res.status === 204) {
        return undefined as T
    }
    return res.json() as Promise<T>
}
