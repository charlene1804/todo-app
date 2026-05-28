import { useCallback, useEffect, useMemo, useState } from "react"
import * as todosApi from "../api/todosApi"
import { getAccessToken } from "../api/authToken"
import { apiBaseUrl } from "../env"
import { ApiError } from "../api/http"
import type { Todo } from "../types/todo"

export type { Todo as TodoItem } from "../types/todo"

function errorMessage(e: unknown): string {
    if (e instanceof ApiError) return e.message
    if (e instanceof Error) return e.message
    return "エラーが発生しました"
}

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const isAuthenticated = Boolean(getAccessToken())
    const hasApiUrl = Boolean(apiBaseUrl())

    const loadTodos = useCallback(async () => {
        setIsInitialLoading(true)
        setError(null)
        if (!apiBaseUrl()) {
            setTodos([])
            setError("VITE_API_URL が未設定です")
            setIsInitialLoading(false)
            return
        }
        if (!getAccessToken()) {
            setTodos([])
            setIsInitialLoading(false)
            return
        }
        try {
            const list = await todosApi.listTodos()
            setTodos(list)
        } catch (e) {
            setError(errorMessage(e))
            setTodos([])
        } finally {
            setIsInitialLoading(false)
        }
    }, [])

    useEffect(() => {
        queueMicrotask(() => {
            void loadTodos()
        })
    }, [loadTodos])

    useEffect(() => {
        function onTokenChange() {
            queueMicrotask(() => {
                void loadTodos()
            })
        }
        window.addEventListener("access-token-changed", onTokenChange)
        return () =>
            window.removeEventListener("access-token-changed", onTokenChange)
    }, [loadTodos])

    const interactionsDisabled =
        isInitialLoading || !hasApiUrl || !isAuthenticated

    const addTodo = useCallback(
        async (text: string): Promise<boolean> => {
            const trimmed = text.trim()
            if (!trimmed) return false
            if (!hasApiUrl || !getAccessToken()) {
                setError("ログインが必要です")
                return false
            }
            setError(null)
            try {
                const created = await todosApi.createTodo(trimmed)
                setTodos((prev) => [...prev, created])
                return true
            } catch (e) {
                setError(errorMessage(e))
                return false
            }
        },
        [hasApiUrl]
    )

    const toggleTodo = useCallback(async (id: string) => {
        if (!hasApiUrl || !getAccessToken()) return
        const current = todos.find((t) => t.id === id)
        if (!current) return
        setError(null)
        try {
            const updated = await todosApi.patchTodo(id, {
                completed: !current.completed,
            })
            setTodos((prev) =>
                prev.map((t) => (t.id === id ? updated : t))
            )
        } catch (e) {
            setError(errorMessage(e))
        }
    }, [hasApiUrl, todos])

    const deleteTodo = useCallback(
        async (id: string) => {
            if (!hasApiUrl || !getAccessToken()) return
            setError(null)
            try {
                await todosApi.deleteTodo(id)
                setTodos((prev) => prev.filter((t) => t.id !== id))
            } catch (e) {
                setError(errorMessage(e))
            }
        },
        [hasApiUrl]
    )

    const deleteSelected = useCallback(async () => {
        if (!hasApiUrl || !getAccessToken()) return
        const ids = todos.filter((t) => t.completed).map((t) => t.id)
        if (ids.length === 0) return
        setError(null)
        try {
            await Promise.all(ids.map((id) => todosApi.deleteTodo(id)))
            setTodos((prev) => prev.filter((t) => !t.completed))
        } catch (e) {
            setError(errorMessage(e))
        }
    }, [hasApiUrl, todos])

    const deleteAll = useCallback(async () => {
        if (!hasApiUrl || !getAccessToken()) return
        if (todos.length === 0) return
        setError(null)
        try {
            await Promise.all(todos.map((t) => todosApi.deleteTodo(t.id)))
            setTodos([])
        } catch (e) {
            setError(errorMessage(e))
        }
    }, [hasApiUrl, todos])

    const hasSelected = useMemo(
        () => todos.some((t) => t.completed),
        [todos]
    )

    return {
        todos,
        isInitialLoading,
        error,
        isAuthenticated,
        hasApiUrl,
        reload: loadTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
        deleteSelected,
        deleteAll,
        hasSelected,
        interactionsDisabled,
    }
}
