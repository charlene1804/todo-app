const STORAGE_KEY = "accessToken"

export function getAccessToken(): string | null {
    try {
        return window.localStorage.getItem(STORAGE_KEY)
    } catch {
        return null
    }
}

export function setAccessToken(token: string): void {
    window.localStorage.setItem(STORAGE_KEY, token)
    window.dispatchEvent(new Event("access-token-changed"))
}

export function clearAccessToken(): void {
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event("access-token-changed"))
}
