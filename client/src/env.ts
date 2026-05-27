export function apiBaseUrl(): string {
    const raw = import.meta.env.VITE_API_URL
    if (typeof raw !== "string") return ""
    return raw.trim().replace(/\/$/, "")
}
